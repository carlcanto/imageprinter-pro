# Usamos una imagen oficial de Node para construir la app
FROM node:20 AS build

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos y dependencias
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Copiar el resto de la app
COPY . .

# Construir la app para producción
RUN npm run build

# Usar Nginx para servir los archivos estáticos
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
