const sharp = require('sharp');

async function overlayTextOnImage(imageBuffer, name, eventName, certificateDate, coordinates, certificateId, rank = null) {
  try {
    if (!Buffer.isBuffer(imageBuffer)) {
      throw new Error('Invalid image buffer provided');
    }

    // Get image dimensions
    const metadata = await sharp(imageBuffer).metadata();
    const { width, height } = metadata;

    // Create SVG with exact dimensions
    const svgText = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <style>
          .text { 
            font-family: Arial; 
            fill: black; 
            dominant-baseline: middle;
            text-anchor: middle;
          }
          .name { font-size: 48px; font-weight: bold; }
          .event { font-size: 36px; }
          .date { font-size: 24px; }
          .id { font-size: 16px; font-family: monospace; }
          .rank { font-size: 36px; font-weight: bold; fill: #4F46E5; }
        </style>
        ${Object.entries(coordinates).map(([key, value]) => {
          if (!value) return '';
          
          let className = '';
          let text = '';
          
          switch (key) {
            case 'name':
              className = 'name';
              text = name;
              break;
            case 'event':
              className = 'event';
              text = eventName;
              break;
            case 'date':
              className = 'date';
              text = certificateDate;
              break;
            case 'certificateId':
              className = 'id';
              text = certificateId;
              break;
            case 'rank':
              if (rank) {
                className = 'rank';
                text = rank;
              }
              break;
          }

          if (!text) return '';

          return `
            <text 
              x="${value.x}" 
              y="${value.y}" 
              class="text ${className}"
            >${text}</text>
          `;
        }).join('')}
      </svg>
    `;

    // Create a buffer from the SVG
    const svgBuffer = Buffer.from(svgText);

    // Composite the SVG onto the image
    const outputBuffer = await sharp(imageBuffer)
      .composite([{
        input: svgBuffer,
        top: 0,
        left: 0,
        blend: 'over'
      }])
      .jpeg({ quality: 90 })
      .toBuffer();

    return outputBuffer;
  } catch (error) {
    console.error('Error in overlayTextOnImage:', error);
    throw error;
  }
}

module.exports = overlayTextOnImage;