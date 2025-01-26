
const Certificate = require('./certificate.model');
const User = require('../auth/auth.model');
const Event = require('../events/events.model');
const Subevent = require('../events/subevents.model');
const CertificateUploadHistory = require('./certificateUploadHistory.model');
const overlayTextOnImage = require('../../utils/overlay');
const fs = require('fs').promises;
const path = require('path');
const { sequelize } = require('../../config/dataBase');
const { sendEmailWithAttachment } = require('../../utils/mailer');
const StudentRegistration = require('../events/studentRegistration.model');
const Leaderboard = require('../leaderboard/leaderboard.model');
const { Op } = require('sequelize');

function generateCertificateId(event, subevent, registration, rank = null) {
  const timestamp = Date.now().toString(36);
  const eventPrefix = event.event_name
    .replace(/[^a-zA-Z0-9]/g, '')
    .substr(0, 3)
    .toUpperCase();
  const subEventPrefix = subevent.title
    .replace(/[^a-zA-Z0-9]/g, '')
    .substr(0, 3)
    .toUpperCase();
  const regId = registration.id.toString().padStart(4, '0');
  const rankSuffix = rank ? `-R${rank}` : '';
  
  return `${eventPrefix}-${subEventPrefix}-${regId}${rankSuffix}-${timestamp}`;
}

function generateFileName(certificateId, studentName) {
  const sanitizedName = studentName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  return `${certificateId}_${sanitizedName}.jpg`;
}

function getRankSuffix(rank) {
  if (rank >= 11 && rank <= 13) return 'th';
  const lastDigit = rank % 10;
  switch (lastDigit) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

async function sendCertificateEmail(email, outputPath, name, eventName, isWinner = false) {
  const certificateType = isWinner ? 'merit' : 'participation';
  await sendEmailWithAttachment(
    email, 
    outputPath, 
    name, 
    eventName,
    `Your ${certificateType} certificate for ${eventName}`
  );
}

exports.getCertificatesByUser = async (userId) => {
  try {
    const certificates = await Certificate.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Event,
          attributes: ['event_name']
        },
        {
          model: Subevent,
          attributes: ['title']
        }
      ],
      order: [['issued_at', 'DESC']]
    });

    return certificates;
  } catch (error) {
    console.error('Error fetching certificates:', error);
    throw new Error('Failed to fetch certificates');
  }
};

exports.getCertificate = async (userId, eventId, subEventId) => {
  try {
    const certificate = await Certificate.findOne({
      where: {
        user_id: userId,
        event_id: eventId,
        subevent_id: subEventId
      },
      include: [
        {
          model: Event,
          attributes: ['event_name']
        },
        {
          model: Subevent,
          attributes: ['title']
        }
      ]
    });

    if (!certificate) {
      throw new Error('Certificate not found');
    }

    return certificate;
  } catch (error) {
    console.error('Error fetching certificate:', error);
    throw error;
  }
};

exports.generateBulkCertificates = async (inputs) => {
  const event_id = parseInt(inputs.body.event_id);
  const subevent_id = parseInt(inputs.body.subevent_id);
  const templateType = inputs.body.templateType || 'participation';
  let uploadHistory;
  let transaction;

  try {
    if (!inputs.files || !inputs.files.pdfFileInput) {
      throw new Error('Missing template image');
    }

    const coordinates = {
      name: {
        x: parseInt(inputs.body.nameX),
        y: parseInt(inputs.body.nameY)
      },
      event: {
        x: parseInt(inputs.body.eventX),
        y: parseInt(inputs.body.eventY)
      },
      date: {
        x: parseInt(inputs.body.dateX),
        y: parseInt(inputs.body.dateY)
      },
      certificateId: {
        x: parseInt(inputs.body.certificateIdX),
        y: parseInt(inputs.body.certificateIdY)
      },
      rank: inputs.body.rankX && inputs.body.rankY ? {
        x: parseInt(inputs.body.rankX),
        y: parseInt(inputs.body.rankY)
      } : null
    };

    const templateImageBuffer = await fs.readFile(inputs.files.pdfFileInput[0].path);
    transaction = await sequelize.transaction();

    const event = await Event.findByPk(event_id);
    const subevent = await Subevent.findByPk(subevent_id);
    
    if (!event || !subevent) {
      throw new Error('Event or subevent not found');
    }

    uploadHistory = await CertificateUploadHistory.create({
      userId: inputs.user?.id || 1,
      certificateId: Math.round(Math.random() * 100000),
      uploadDate: new Date(),
      uploadStatus: 'Processing',
      uploadFileUrl: inputs.files.pdfFileInput[0].path,
      uploadFileStatus: 'Pending',
      uploadFileComment: `File uploaded for ${templateType} certificate generation`,
    }, { transaction });

    let students = [];
    if (templateType === 'merit') {
      const leaderboard = await Leaderboard.findAll({
        where: { event_id, subevent_id },
        order: [['rank', 'ASC']],
        limit: 3
      });

      const registrations = await StudentRegistration.findAll({
        where: {
          event_id,
          subevent_id,
          student_id: leaderboard.map(entry => entry.student_id),
          payment_status: 'paid',
          attendance: true
        }
      });

      students = leaderboard.map(entry => {
        const registration = registrations.find(reg => reg.student_id === entry.student_id);
        if (registration) {
          return {
            ...registration.toJSON(),
            rank: entry.rank,
            score: entry.score
          };
        }
        return null;
      }).filter(Boolean);
    } else if (templateType === 'participation') {
      const winners = await Leaderboard.findAll({
        where: { event_id, subevent_id },
        attributes: ['student_id']
      });

      const winnerIds = winners.map(winner => winner.student_id);

      students = await StudentRegistration.findAll({
        where: { 
          event_id,
          subevent_id,
          payment_status: 'paid',
          attendance: true,
          student_id: { [Op.notIn]: winnerIds } // Exclude winners
        }
      });
    }

    if (!students.length) {
      throw new Error(`No eligible students found for ${templateType} certificates`);
    }

    const baseDir = path.join(process.cwd(), 'Records');
    await fs.mkdir(baseDir, { recursive: true });

    for (const student of students) {
      try {
        const eventName = student.event_name;
        const email = student.student_email;
        const name = student.student_name;
        const certificateDate = new Date().toLocaleDateString();

        if (!eventName || !email || !name) {
          console.error('Missing required data:', { eventName, email, name });
          continue;
        }

        const certificateId = generateCertificateId(event, subevent, student, student.rank);
        const fileName = generateFileName(certificateId, name);
        const outputDir = path.join(baseDir, eventName.replace(/[^a-zA-Z0-9]/g, '_'));
        await fs.mkdir(outputDir, { recursive: true });
        const outputPath = path.join(outputDir, fileName);

        const certificateBuffer = await overlayTextOnImage(
          templateImageBuffer,
          name,
          eventName,
          certificateDate,
          coordinates,
          certificateId,
          student.rank ? `${student.rank}${getRankSuffix(student.rank)} Place` : null
        );

        if (!Buffer.isBuffer(certificateBuffer)) {
          throw new Error('Invalid certificate buffer generated');
        }

        await fs.writeFile(outputPath, certificateBuffer);

        await Certificate.create({
          user_id: student.student_id,
          event_id,
          subevent_id,
          certificate_url: outputPath,
          certificate_id: certificateId,
          rank: student.rank || null,
          issued_at: new Date(),
        }, { transaction });

        const isWinner = templateType === 'merit' && student.rank;
        await sendCertificateEmail(email, outputPath, name, eventName, isWinner);
      } catch (err) {
        console.error('Error processing certificate:', err);
      }
    }

    await uploadHistory.update({
      uploadStatus: 'Completed',
      uploadFileStatus: 'Completed',
    }, { transaction });

    await Subevent.update(
      { certificate_Generated: true },
      { where: { id: subevent_id }, transaction }
    );

    await transaction.commit();
    return { success: true, message: 'Certificates generated successfully' };
  } catch (err) {
    console.error('Certificate generation error:', err);
    if (transaction) {
      await transaction.rollback();
    }
    throw err;
  }
}