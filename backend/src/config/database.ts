import { Sequelize } from 'sequelize';

// Spécifie le chemin relatif correct pour accéder à data.sqlite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  define: {
    timestamps: false, // Optionnel, si tu ne veux pas de colonnes `createdAt` et `updatedAt`
  },
  storage: './data.sqlite', // Cela doit pointer vers ton fichier `data.sqlite`
});

export default sequelize;
