const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 8080;

app.get('/api/image/random', async (req, res) => {
    // app.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://picsum.photos/200/300', {
      responseType: 'arraybuffer'
    });
    
    const imageBuffer = Buffer.from(response.data, 'binary');
    res.set('Content-Type', 'image/jpeg');
    res.send(imageBuffer);
  } catch (error) {
    console.error('Error fetching random image:', error);
    res.status(500).json({ error: 'Failed to fetch random image' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});