# Usamos una versión LTS para evitar errores inesperados de librerías
FROM node:22-slim

# Directorio de trabajo
WORKDIR /app

# Copiamos archivos de dependencias desde la raíz de tu proyecto
COPY package*.json ./

# Instalamos dependencias (esto se queda en caché si no cambias los paquetes)
RUN npm install --production

# Copiamos la carpeta de la lógica de la IA
COPY apio-conciencia ./apio-conciencia

# Exponemos el puerto de Daniela
EXPOSE 3001

# Comando de arranque
# Asegúrate de que server.cjs no dependa de archivos fuera de 'apio-conciencia'
CMD ["node", "apio-conciencia/server.cjs"]
