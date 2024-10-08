import express from 'express';
import bodyParser from 'body-parser';
import qr from 'qr-image';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware to serve static files
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the main HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle form submission to generate QR code
app.post('/generate', (req, res) => {
  const url = req.body.url;
  const qr_svg = qr.image(url, { type: 'png' });
  const output = path.join(__dirname, 'public', 'qr_img.png');

  // Generate the QR code image
  qr_svg.pipe(fs.createWriteStream(output));

  // Send response to the client to display the QR code image
  qr_svg.on('end', () => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>QR Code Generated</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
          img { margin-top: 20px; border: 2px solid #333; }
          .btn { text-decoration: none; padding: 10px 20px; margin-top: 30px; display: inline-block; background-color: #008cba; color: white; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>QR Code Successfully Generated!</h1>
        <img src="/qr_img.png" alt="Generated QR Code" />
        <br>
        <a href="/" class="btn">Generate Another QR Code</a>
      </body>
      </html>
    `);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
