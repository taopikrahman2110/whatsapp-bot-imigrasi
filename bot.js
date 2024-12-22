const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
require('./keepalive'); // Keep-alive server

// Konfigurasi bot WhatsApp
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './whatsapp-session',
    }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
});

// Event saat QR Code diterima
client.on('qr', (qr) => {
    console.log('QR Code diterima. Silakan login di lokal jika diperlukan.');
});

// Event saat bot berhasil login
client.on('authenticated', () => {
    console.log('Bot berhasil diautentikasi!');
});

// Event saat bot siap
client.on('ready', () => {
    console.log('Bot sudah siap!');
});

// Event saat bot terputus
client.on('disconnected', (reason) => {
    console.error('Bot terputus:', reason);
    client.destroy().then(() => client.initialize()); // Restart bot
});

// Tangani error
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

// Mulai bot
client.initialize();
