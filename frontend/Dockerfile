# frontend/Dockerfile.dev

# Imagen base
FROM node:20

# Establecer directorio de trabajo
WORKDIR /app

# Instalar dependencias (solo lo necesario al principio)
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Copiar el resto de los archivos
COPY . .

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar el servidor en modo desarrollo
CMD ["npm", "start"]
