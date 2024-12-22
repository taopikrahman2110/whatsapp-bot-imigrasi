const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
require ('./keepalive.js');

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './whatsapp-session',
    }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
        ],
        ignoreHTTPSErrors: true,
    },
});

client.on('qr', (qr) => {
    console.log('Scan QR Code berikut:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Bot sudah siap!');
});

client.on('message', async (message) => {
    try {
        console.log('Pesan diterima dari:', message.from);
        console.log('Isi pesan:', message.body);

        const nataruGroupId = '120363362433243497@g.us';
        const csGroupId = '120363379800349138@g.us';

        if (message.from === nataruGroupId) {
            await client.sendMessage(csGroupId, message.body);
            console.log(`Pesan diteruskan ke Grup CS: ${message.body}`);
        }
    } catch (err) {
        console.error('Terjadi kesalahan saat menangani pesan:', err.message);
    }
});

client.on('disconnected', (reason) => {
    console.error('Client disconnected:', reason);
    client.destroy().then(() => client.initialize());
});

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

client.initialize();
