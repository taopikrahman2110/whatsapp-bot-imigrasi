const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
require('./keepalive');


// Gunakan LocalAuth untuk menyimpan sesi
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './whatsapp-session', // Folder untuk menyimpan sesi
    }),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Tambahkan argumen Puppeteer
    },
});

// Menampilkan QR Code untuk login
client.on('qr', (qr) => {
    console.log('Scan QR Code berikut:');
    qrcode.generate(qr, { small: true });
});

// Notifikasi saat bot siap
client.on('ready', () => {
    console.log('Bot sudah siap!');
});

// Logika untuk meneruskan pesan
client.on('message', (message) => {
    console.log('Pesan diterima dari:', message.from);
    const nataruGroupId = '120363362433243497@g.us'; // ID Grup Nataru
    const csGroupId = '120363379800349138@g.us'; // ID Grup CS

    if (message.from === nataruGroupId) {
        client.sendMessage(csGroupId, message.body)
        .then(() => console.log(`Pesan diteruskan ke Grup CS: ${message.body}`))
        .catch(err => console.error('Gagal meneruskan pesan:', err));
    }
});

// Mulai klien
client.initialize();
