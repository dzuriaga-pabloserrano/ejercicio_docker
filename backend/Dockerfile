#dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

#copia lo que hay en el directorio actual del host (1º .)al directorio de trabajo del contenedor (2º .)
COPY . . 

EXPOSE 3000

CMD ["npm", "start"]