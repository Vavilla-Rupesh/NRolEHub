// const CertificatesService = require('./certificate.service');

// exports.generateCertificates = async (req, res) => {
//   try {
//     const certificates = await CertificatesService.generateCertificatesForEvent(req.params.eventId);
//     res.status(201).json({ message: 'Certificates generated successfully', certificates });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.getCertificatesByUser = async (req, res) => {
//   try {
//     const certificates = await CertificatesService.getCertificatesByUser(req.user.id);
//     res.status(200).json(certificates);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.getCertificate = async (req, res) => {
//   try {
//     const { type = 'participation' } = req.query;
//     const certificate = await CertificatesService.getCertificate(
//       req.user.id, 
//       req.params.eventId,
//       req.query.subevent_id,
//       type
//     );
    
//     if (!certificate) {
//       throw new Error('Certificate not found');
//     }

//     // Send the certificate file
//     res.download(certificate.certificate_url);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

// exports.generateBulkCertificates = async(req,res) => {
//   try {
//     const certificate = await CertificatesService.generateBulkCertificates(req)
//     res.status(200).json(certificate)
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: error.message });
//   }
// }
const CertificatesService = require('./certificate.service');

exports.generateCertificates = async (req, res) => {
  try {
    const certificates = await CertificatesService.generateCertificatesForEvent(req.params.eventId);
    res.status(201).json({ message: 'Certificates generated successfully', certificates });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCertificatesByUser = async (req, res) => {
  try {
    const certificates = await CertificatesService.getCertificatesByUser(req.user.id);
    res.status(200).json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCertificate = async (req, res) => {
  try {
    const certificate = await CertificatesService.getCertificate(
      req.user.id, 
      req.params.eventId,
      req.query.subevent_id
    );
    
    if (!certificate) {
      throw new Error('Certificate not found');
    }

    // Send the certificate file
    res.download(certificate.certificate_url);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.generateBulkCertificates = async(req,res) => {
  try {
    const certificate = await CertificatesService.generateBulkCertificates(req)
    res.status(200).json(certificate)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}