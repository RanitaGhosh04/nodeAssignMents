const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { nanoid } = require('nanoid');

const app = express();
const port = process.env.PORT || 3000;
const urlsFile = path.join(__dirname, 'urls.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper function to read URLs from file
async function readUrls() {
  try {
    const data = await fs.readFile(urlsFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return an empty object
      return {};
    }
    throw error;
  }
}

// Helper function to write URLs to file
async function writeUrls(urls) {
  await fs.writeFile(urlsFile, JSON.stringify(urls, null, 2));
}

// Shorten URL
app.post('/shorten', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const urls = await readUrls();
    
    // Check if URL already exists
    for (const [shortCode, originalUrl] of Object.entries(urls)) {
      if (originalUrl === url) {
        return res.json({ shortUrl: `http://localhost:${port}/${shortCode}` });
      }
    }

    const shortCode = nanoid(6);
    urls[shortCode] = url;

    await writeUrls(urls);

    res.json({ shortUrl: `http://localhost:${port}/${shortCode}` });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Redirect to original URL
app.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;

  try {
    const urls = await readUrls();

    if (urls[shortCode]) {
      return res.redirect(urls[shortCode]);
    }

    res.status(404).json({ error: 'URL not found' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`URL shortener app listening at http://localhost:${port}`);
});