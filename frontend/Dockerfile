# frontend/Dockerfile.dev

# Imagen base (usando alpine para reducir tamaño)
FROM node:20-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias para aprovechar caché
COPY package*.json ./
RUN npm install && npm cache clean --force

# Copiar el resto de los archivos
COPY . .

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar el servidor en modo desarrollo
CMD ["npm", "start"]
