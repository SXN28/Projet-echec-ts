import sequelize from './src/config/database';
import { User } from './src/models/user.model';
import { Game } from './src/models/game.model';
import { Piece } from './src/models/piece.model';
import { Move } from './src/models/move.model';

// Associer les modèles entre eux
User.hasMany(Game, { foreignKey: 'whitePlayerId' });
User.hasMany(Game, { foreignKey: 'blackPlayerId' });
Game.belongsTo(User, { foreignKey: 'whitePlayerId' });
Game.belongsTo(User, { foreignKey: 'blackPlayerId' });

Game.hasMany(Piece, { foreignKey: 'gameId' });
Piece.belongsTo(Game, { foreignKey: 'gameId' });

Game.hasMany(Move, { foreignKey: 'gameId' });
Move.belongsTo(Game, { foreignKey: 'gameId' });

sequelize
  .sync()
  .then(async () => {
    console.log('Database synchronized!');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });
