console.log('Memulai aplikasi...');

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const botStatus = require('./keepalive'); // Import keep-alive dan status

console.log('Konfigurasi WhatsApp Client...');

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './whatsapp-session', // Folder untuk menyimpan sesi
    }),
    puppeteer: {
        headless: true, // Jalankan tanpa UI
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Argumen Puppeteer untuk bypass sandbox
    },
});

console.log('WhatsApp Client dikonfigurasi. Menunggu QR Code atau sesi lama...');

// Event saat QR Code diterima
client.on('qr', (qr) => {
    console.log('QR Code diterima. Railway tidak dapat menampilkan QR Code. Silakan scan di lokal.');
    botStatus.qrReceived = true;
    botStatus.lastEvent = 'QR Code received';
});

// Event saat bot berhasil diautentikasi
client.on('authenticated', () => {
    console.log('Bot berhasil diautentikasi!');
    botStatus.authenticated = true;
    botStatus.lastEvent = 'Authenticated';
});

// Event saat bot siap digunakan
client.on('ready', () => {
    console.log('Bot sudah siap! Sesi berjalan dengan baik.');
    botStatus.ready = true;
    botStatus.lastEvent = 'Ready';
});

// Logika untuk meneruskan pesan
client.on('message', async (message) => {
    try {
        console.log('Pesan diterima dari:', message.from);
        console.log('Isi pesan:', message.body);

        const nataruGroupId = '120363362433243497@g.us'; // ID Grup Nataru
        const csGroupId = '120363379800349138@g.us'; // ID Grup CS

        if (message.from === nataruGroupId) {
            await client.sendMessage(csGroupId, message.body);
            console.log(`Pesan diteruskan ke Grup CS: ${message.body}`);
        }
    } catch (err) {
        console.error('Terjadi kesalahan saat menangani pesan:', err.message);
    }
});

// Event saat bot terputus
client.on('disconnected', (reason) => {
    console.error('Bot terputus:', reason);
    botStatus.ready = false;
    botStatus.lastEvent = `Disconnected: ${reason}`;
    client.destroy().then(() => client.initialize()); // Restart bot
});

// Event saat autentikasi gagal
client.on('auth_failure', (msg) => {
    console.error('Autentikasi gagal:', msg);
    botStatus.authenticated = false;
    botStatus.lastEvent = 'Auth failure';
});

// Tangani error yang tidak tertangkap
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

// Mulai bot
client.initialize();
