import sequelize from './src/config/database';
import {User} from './src/models/user.model';
import {Game} from './src/models/game.model';
import {Piece} from './src/models/piece.model';
import {Move} from './src/models/move.model';

// Associer les modèles entre eux
User.hasMany(Game, {foreignKey: 'whitePlayerId'});
User.hasMany(Game, {foreignKey: 'blackPlayerId'});
Game.belongsTo(User, {foreignKey: 'whitePlayerId'});
Game.belongsTo(User, {foreignKey: 'blackPlayerId'});

Game.hasMany(Piece, {foreignKey: 'gameId'});
Piece.belongsTo(Game, {foreignKey: 'gameId'});

Game.hasMany(Move, {foreignKey: 'gameId'});
Move.belongsTo(Game, {foreignKey: 'gameId'});

sequelize
    .sync()
    .then(async () => {
        console.log('Database synchronized!');

        // Vérifier si le User "Guest" existe déjà
        const [guestUser, created] = await User.findOrCreate({
            where: {username: 'Guest'},
            defaults: {
                username: 'Guest',
                password: 'defaultpassword',
                elo: 1200,
                shareReplays: false,
            },
        });

        if (created) {
            console.log('User "Guest" created with default values: username="Guest", password="defaultpassword", elo=1200');
        } else {
            console.log('User "Guest" already exists');
        }
    })
    .catch((error) => {
        console.error('Error syncing database:', error);
    });
