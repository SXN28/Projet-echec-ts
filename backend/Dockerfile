# Utilise une image Node.js comme base
FROM node:16

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier le package.json et installer les dépendances
COPY package*.json ./
RUN npm install --production

# Copier le reste du code source
COPY . .

# Exposer le port de l'application
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "start"]
