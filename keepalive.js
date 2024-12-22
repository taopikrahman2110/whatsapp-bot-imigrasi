const http = require('http');

const PORT = process.env.PORT || 8080;

// Status bot
const botStatus = {
    qrReceived: false,
    authenticated: false,
    ready: false,
    lastEvent: 'Initializing',
};

// Server untuk memantau status bot
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(botStatus));
    res.end();
}).listen(PORT, () => {
    console.log(`Keep-alive server berjalan pada port: ${PORT}`);
});

module.exports = botStatus;
