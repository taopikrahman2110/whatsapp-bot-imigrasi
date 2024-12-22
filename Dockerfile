FROM node:16

# Install dependencies untuk Puppeteer
RUN apt-get update && apt-get install -y \
    chromium \
    libnss3 \
    fonts-liberation \
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

# Tetapkan path Chromium untuk Puppeteer
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Expose port untuk Railway
EXPOSE 8080

# Jalankan aplikasi
CMD ["node", "bot.js"]
