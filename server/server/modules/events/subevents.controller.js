const SubeventService = require('./subevents.service');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

exports.createSubevent = async (req, res) => {
  try {
    const files = req.files;
    const subevent = await SubeventService.createSubevent({
      ...req.body,
      resources: files ? files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path
      })) : []
    });
    res.status(201).json({ message: 'Subevent created and mapped successfully', subevent });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getSubeventsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required' });
    }
    
    const subevents = await SubeventService.getSubeventsByEvent(eventId);
    res.status(200).json(subevents);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.downloadResources = async (req, res) => {
  try {
    const { id } = req.params;
    const subevent = await SubeventService.getSubeventById(id);
    
    if (!subevent || !subevent.resources || subevent.resources.length === 0) {
      return res.status(404).json({ message: 'No resources found' });
    }

    // Ensure temp directory exists
    const tempDir = path.join(__dirname, '../../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const zipFileName = `${subevent.title.replace(/[^a-z0-9]/gi, '_')}_resources.zip`;
    const zipFilePath = path.join(tempDir, zipFileName);

    // Create write stream for zip file
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      res.download(zipFilePath, zipFileName, (err) => {
        // Delete the temporary zip file after sending
        fs.unlink(zipFilePath, () => {});
      });
    });

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(output);

    // Add each resource file to the archive
    subevent.resources.forEach(resource => {
      const filePath = path.join(__dirname, '../../public/uploads/events', resource.filename);
      if (fs.existsSync(filePath)) {
        archive.file(filePath, { name: resource.originalName });
      }
    });

    await archive.finalize();
  } catch (error) {
    console.error('Download resources error:', error);
    res.status(500).json({ message: 'Failed to download resources' });
  }
};