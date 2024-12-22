const http = require('http');

http.createServer((req, res) => {
    res.write('Bot is running!');
    res.end();
}).listen(process.env.PORT || 3000);

console.log('Keep-alive server berjalan pada port:', process.env.PORT || 3000);
