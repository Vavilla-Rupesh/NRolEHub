const express = require('express')
require('dotenv').config()
const { syncDatabase } = require('./config/dataBase')
const route = require('./index')
const path = require('path')
const port = process.env.SERVER_PORT
const cors = require('cors')

const app = express()

// Increase payload size limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'public', 'uploads', 'events');
require('fs').mkdirSync(uploadsDir, { recursive: true });

// Serve uploaded files statically with absolute path
app.use('/uploads/events', express.static(uploadsDir));

app.use('/api', route)

syncDatabase().then(() => {
    console.log('Database is ready!');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
});