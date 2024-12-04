# Gunakan Node.js versi 22 sebagai base image
FROM node:22

# Set working directory
WORKDIR /app

# Copy package.json dan package-lock.json ke dalam container
COPY package*.json ./

ENV PORT 3000

# Copy seluruh kode aplikasi (termasuk src)
COPY . .

# Install dependencies
RUN npm install

# Expose port aplikasi
EXPOSE 3000

# Jalankan aplikasi
CMD [ "npm", "run", "start"]
