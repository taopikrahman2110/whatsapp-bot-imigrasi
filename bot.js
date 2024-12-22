console.log('Memulai aplikasi...');

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

// Path folder sesi
const sessionPath = './whatsapp-session';
if (fs.existsSync(sessionPath)) {
    console.log('Folder sesi ditemukan!');
    const files = fs.readdirSync(sessionPath);
    console.log('Isi folder sesi:', files);
} else {
    console.error('Folder sesi TIDAK ditemukan! QR Code akan diperlukan untuk login ulang.');
    fs.mkdirSync(sessionPath, { recursive: true }); // Buat folder sesi jika tidak ada
}

// Konfigurasi WhatsApp Client
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: path.resolve('./whatsapp-session'), // Gunakan path absolut
    }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
});


// Event saat QR Code diterima
client.on('qr', (qr) => {
    console.log('QR Code diterima. Silakan pindai:');
    qrcode.generate(qr, { small: true }); // Tampilkan QR Code di terminal
});

// Event saat bot berhasil diautentikasi
client.on('authenticated', () => {
    console.log('Sesi lama ditemukan dan digunakan. Bot berhasil diautentikasi!');
});

// Event saat bot siap digunakan
client.on('ready', () => {
    console.log('Bot sudah siap! Sesi berjalan dengan baik.');
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
    if (reason === 'UNPAIRED') {
        console.error('Sesi tidak valid lagi. QR Code diperlukan untuk login ulang.');
    }
    client.destroy().then(() => client.initialize()); // Restart bot
});

// Event saat autentikasi gagal
client.on('auth_failure', (msg) => {
    console.error('Autentikasi gagal:', msg);
});

// Tangani error yang tidak tertangkap
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

// Event debugging tambahan untuk memantau status
client.on('change_state', (state) => {
    console.log('State berubah menjadi:', state);
});

// Mulai bot
client.initialize();


// console.log('Memulai aplikasi...');

// const { Client, LocalAuth } = require('whatsapp-web.js');
// const qrcode = require('qrcode-terminal');
// require('./keepalive'); // Import keep-alive server

// console.log('Konfigurasi WhatsApp Client...');

// const client = new Client({
//     authStrategy: new LocalAuth({
//         dataPath: './whatsapp-session', // Folder untuk menyimpan sesi
//     }),
//     puppeteer: {
//         headless: true, // Jalankan tanpa UI
//         args: ['--no-sandbox', '--disable-setuid-sandbox'], // Argumen Puppeteer untuk bypass sandbox
//     },
// });

// console.log('WhatsApp Client dikonfigurasi. Menunggu QR Code atau sesi lama...');

// // Event saat QR Code diterima
// client.on('qr', (qr) => {
//     console.log('QR Code diterima. Silakan pindai di lokal.');
// });

// // Event saat bot berhasil diautentikasi
// client.on('authenticated', () => {
//     console.log('Bot berhasil diautentikasi!');
// });

// // Event saat bot siap digunakan
// client.on('ready', () => {
//     console.log('Bot sudah siap!');
// });

// // Logika untuk meneruskan pesan
// client.on('message', async (message) => {
//     try {
//         console.log('Pesan diterima dari:', message.from);
//         console.log('Isi pesan:', message.body);

//         const nataruGroupId = '120363362433243497@g.us'; // ID Grup Nataru
//         const csGroupId = '120363379800349138@g.us'; // ID Grup CS

//         if (message.from === nataruGroupId) {
//             await client.sendMessage(csGroupId, message.body);
//             console.log(`Pesan diteruskan ke Grup CS: ${message.body}`);
//         }
//     } catch (err) {
//         console.error('Terjadi kesalahan saat menangani pesan:', err.message);
//     }
// });

// // Event saat bot terputus
// client.on('disconnected', (reason) => {
//     console.error('Bot terputus:', reason);
//     client.destroy().then(() => client.initialize()); // Restart bot
// });

// // Tangani error yang tidak tertangkap
// process.on('unhandledRejection', (reason) => {
//     console.error('Unhandled Rejection:', reason);
// });
// process.on('uncaughtException', (error) => {
//     console.error('Uncaught Exception:', error);
// });

// // Mulai bot
// client.initialize();
