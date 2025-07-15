const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: '10mb' }));

app.post('/upload', (req, res) => {
  const { image } = req.body;
  if (!image) return res.status(400).send('No image data');
  
  // Save as file
  const base64Data = image.replace(/^data:image\/png;base64,/, '');
  const filename = `photo_${Date.now()}.png`;
  const filepath = path.join(__dirname, 'uploads', filename);
  
  fs.writeFile(filepath, base64Data, 'base64', (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error saving image');
    }
    console.log(`Saved image: ${filename}`);
    res.send('Image saved');
  });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
