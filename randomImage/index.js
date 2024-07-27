const express = require('express');
const { createApi } = require('unsplash-js');
const fetch = require('node-fetch');

const app = port = 3000;

// Initialize Unsplash API
const unsplash = createApi({
  accessKey: 'YOUR_UNSPLASH_ACCESS_KEY',
  fetch: fetch,
});

// Define route for random image
app.get('/api/image/random', async (req, res) => {
  try {
    const result = await unsplash.photos.getRandom();
    if (result.errors) {
      console.log('error occurred: ', result.errors[0]);
      res.status(500).json({ error: 'An error occurred while fetching the image' });
    } else {
      const photo = result.response;
      res.json({
        id: photo.id,
        url: photo.urls.regular,
        photographer: photo.user.name,
        description: photo.description || photo.alt_description,
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while fetching the image' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});