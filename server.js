import express from 'express';
import bodyParser from 'body-parser';
import qr from 'qr-image';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;


app.use(express.static('public'));
app.use(express.static('views'));
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/generate', (req, res) => {
  const url = req.body.url;
  const qr_svg = qr.image(url, { type: 'png' });
  const output = path.join(__dirname, 'public', 'qr_img.png');


  qr_svg.pipe(fs.createWriteStream(output));


  qr_svg.on('end', () => {
    res.sendFile(path.join(__dirname, 'views', 'success.html'));
  });
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
