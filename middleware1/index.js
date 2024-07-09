const express = require('express');
const app = express();


const loggingMiddleware = (req, res, next) => {
  
  const startTime = Date.now();

  
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  
  const originalEnd = res.end;

  
  res.end = function (...args) {
    
    const processingTime = Date.now() - startTime;

    
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode} (${processingTime}ms)`);

    
    originalEnd.apply(res, args);
  };

  next();
};


app.use(loggingMiddleware);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});