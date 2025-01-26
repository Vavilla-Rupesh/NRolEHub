const nodemailer = require('nodemailer');

async function sendEmailWithAttachment(email, imagePath, name, eventName, contentType = 'image/jpeg') {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Certificate',
            text: `Dear ${name},\n\nPlease find attached your certificate for the event ${eventName}.\n\nBest regards,\nYour Organization`,
            attachments: [
                {
                    filename: `certificate_${name}.jpg`,
                    path: imagePath,
                    contentType: contentType
                },
            ],
        };

        await transporter.sendMail(mailOptions);
        console.log(`Certificate email sent to ${email}`);
    } catch (error) {
        console.error(`Error sending certificate email to ${email}:`, error.message);
        throw error;
    }
}

const sendOTP = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}`);
    } catch (error) {
        console.error(`Error sending OTP email to ${email}:`, error.message);
        throw error;
    }
};

const sendReceiptEmail = async (to, subject, htmlContent, attachments) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html: htmlContent,
            attachments,
        };

        await transporter.sendMail(mailOptions);
        console.log('Receipt email sent successfully');
    } catch (error) {
        console.error('Error sending receipt email:', error.message);
        throw error;
    }
};

const sendNotificationMail = async (to, subject, text, html) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
            html,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${to}`);
    } catch (error) {
        console.error(`Failed to send email to ${to}:`, error.message);
        throw error;
    }
};

// New function to send bulk emails
const sendBulkEmails = async (recipients, subject, content, attachments = null) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
            pool: true, // Use pooled connections
            maxConnections: 5, // Limit concurrent connections
            maxMessages: 100, // Limit messages per connection
        });

        const results = await Promise.all(
            recipients.map(async (recipient) => {
                try {
                    const mailOptions = {
                        from: process.env.EMAIL_USER,
                        to: recipient.email,
                        subject,
                        html: content.replace('{name}', recipient.name || ''),
                        attachments,
                    };

                    await transporter.sendMail(mailOptions);
                    return { email: recipient.email, success: true };
                } catch (error) {
                    console.error(`Failed to send email to ${recipient.email}:`, error.message);
                    return { email: recipient.email, success: false, error: error.message };
                }
            })
        );

        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;

        return {
            totalSent: recipients.length,
            successful,
            failed,
            details: results
        };
    } catch (error) {
        console.error('Bulk email error:', error.message);
        throw error;
    }
};

module.exports = {
    sendEmailWithAttachment,
    sendOTP,
    sendBulkEmails,
    sendReceiptEmail,
    sendNotificationMail
};