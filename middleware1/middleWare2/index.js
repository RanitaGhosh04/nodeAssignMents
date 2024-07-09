const express = require('express');
const morgan = require('morgan');
const app = express();


const requestLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url} from ${req.ip}`);
    next();
};


const infoLogger = (req, res, next) => {
    console.log(`[INFO] Request received: ${req.method} ${req.url}`);
    next();
};

const debugLogger = (req, res, next) => {
    console.log(`[DEBUG] Request details:
        Method: ${req.method}
        URL: ${req.url}
        IP: ${req.ip}
        Headers: ${JSON.stringify(req.headers)}
    `);
    next();
};


app.use(requestLogger); 
app.use(morgan('combined')); 
app.use(infoLogger);
app.use(debugLogger);

// Sample routes
app.get('/', (req, res) => {
    res.end('Hello, World!');
});

app.post('/api/data', (req, res) => {
    res.json({ message: 'Data received' });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});