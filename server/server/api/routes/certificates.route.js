const express = require('express');
const router = express.Router();
const CertificatesController = require('../../modules/certificates/certificate.controller');
const AuthMiddleware = require('../middleware/auth.middleware')
const upload = require('../../utils/multer')

// Certificates Management
// router.post('/generate/:eventId', AuthMiddleware.authenticate,AuthMiddleware.authorize(["admin"]), CertificatesController.generateCertificates); // Admin access required
router.get('/', AuthMiddleware.authenticate, CertificatesController.getCertificatesByUser); // List all certificates for the logged-in user
router.get('/:eventId', AuthMiddleware.authenticate, CertificatesController.getCertificate); // Get a specific certificate for an event

router.post('/upload',AuthMiddleware.authenticate,AuthMiddleware.authorize(["admin"]) , upload.fields([{ name: 'pdfFileInput', maxCount: 1 }]), CertificatesController.generateBulkCertificates);
module.exports = router;
