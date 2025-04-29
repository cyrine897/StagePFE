# Étape 1 : Build Angular
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --prod

# Étape 2 : Serveur nginx
FROM nginx:alpine

COPY --from=build /app/dist/sahty-app /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
