import sequelize from './src/config/database'; // Connexion Sequelize
import { Player } from './src/models/player.model'; // Importer les modèles
import { Game } from './src/models/game.model';
import { Piece } from './src/models/piece.model';
import { Move } from './src/models/move.model';

// Associer les modèles entre eux si nécessaire
Player.hasMany(Game, { foreignKey: 'whitePlayerId' });
Player.hasMany(Game, { foreignKey: 'blackPlayerId' });
Game.belongsTo(Player, { foreignKey: 'whitePlayerId' });
Game.belongsTo(Player, { foreignKey: 'blackPlayerId' });

Game.hasMany(Piece, { foreignKey: 'gameId' });
Piece.belongsTo(Game, { foreignKey: 'gameId' });

Game.hasMany(Move, { foreignKey: 'gameId' });
Move.belongsTo(Game, { foreignKey: 'gameId' });

// Synchroniser la base de données
sequelize.sync() // Crée les tables si elles n'existent pas
  .then(async () => {
    console.log('Database synchronized!');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });
