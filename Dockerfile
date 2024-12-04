# Gunakan Node.js versi 22 sebagai base image
FROM node:22

# Set working directory
WORKDIR /app

# Copy package.json dan package-lock.json ke dalam container
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy seluruh kode aplikasi (termasuk src)
COPY . .

# Atur variabel lingkungan (opsional, jika Anda menggunakan file .env)
ENV NODE_ENV=production

ENV PORT=3000

# Expose port aplikasi
EXPOSE 3000

# Jalankan aplikasi
CMD [ "npm", "run", "start"]
