# Gunakan image Node.js sebagai basis
FROM node:16

# Install dependencies yang diperlukan oleh Puppeteer
RUN apt-get update && apt-get install -y \
    chromium \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxi6 \
    libxtst6 \
    libpangocairo-1.0-0 \
    libxrandr2 \
    libcups2 \
    libxshmfence-dev \
    libgbm-dev \
    libgtk-3-0 \
    --no-install-recommends && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Tetapkan direktori kerja
WORKDIR /app

# Salin file package.json dan package-lock.json
COPY package.json package-lock.json ./

# Install dependencies Node.js
RUN npm install

# Salin semua file aplikasi
COPY . .

# Set environment variable untuk Puppeteer
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Expose port (opsional)
EXPOSE 3000

# Jalankan aplikasi
CMD ["node", "bot.js"]
