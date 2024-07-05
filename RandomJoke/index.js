const express = require('express');
const fetch = require('node-fetch');
const jokes = require('./data');

const app = express();

const PORT = 8080;

const jokeMiddleware = (req, res, next) => {
  req["joke"] = "This is a joke";
  console.log('Middleware triggered');
  next();
}

app.get('/', jokeMiddleware, (req, res) => {
  console.log(req.joke);
  const requiredRandomJokeIndex = Math.floor(Math.random() * jokes.length);
  return res.status(200).json(jokes[requiredRandomJokeIndex]);
});

app.get('/joke/:jokeId', (req, res) => {
  const jokeId = req.params.jokeId;
  
  if (!Number(jokeId) || Number(jokeId) < 0){
    return res.status(400).json({error: "Invalid joke id"});
  }
  
  return res.status(200).json(jokes.find(joke => joke.id == jokeId));
});

// Updated route for random images
app.get('/api/images/random', async (req, res) => {
  try {
    const response = await fetch('https://picsum.photos/v2/list?limit=1');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data && data.length > 0) {
      const imageUrl = data[0].download_url;
      res.json({ imageUrl });
    } else {
      throw new Error('No image data received');
    }
  } catch (error) {
    console.error('Error fetching random image:', error);
    res.status(500).json({ error: 'Failed to fetch random image', details: error.message });
  }
});

// Updated route for combined random joke and image
app.get('/api/random', async (req, res) => {
  try {
    const randomJokeIndex = Math.floor(Math.random() * jokes.length);
    const randomJoke = jokes[randomJokeIndex];

    const imageResponse = await fetch('https://picsum.photos/v2/list?limit=1');
    if (!imageResponse.ok) {
      throw new Error(`HTTP error! status: ${imageResponse.status}`);
    }
    const imageData = await imageResponse.json();
    if (imageData && imageData.length > 0) {
      const imageUrl = imageData[0].download_url;
      res.json({
        joke: randomJoke,
        imageUrl: imageUrl
      });
    } else {
      throw new Error('No image data received');
    }
  } catch (error) {
    console.error('Error fetching random joke and image:', error);
    res.status(500).json({ error: 'Failed to fetch random joke and image', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});      