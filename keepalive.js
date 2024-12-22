const http = require('http');

const PORT = process.env.PORT || 8080;

http.createServer((req, res) => {
    res.write('Bot is running!');
    res.end();
}).listen(PORT, () => {
    console.log(`Keep-alive server berjalan pada port: ${PORT}`);
});
