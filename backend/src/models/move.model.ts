// move.model.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Game from './game.model';  // Importer le modèle Game
import Player from './player.model';  // Importer le modèle Player

export class Move extends Model {
  public id!: number;
  public gameId!: number;
  public playerId!: number;
  public move!: string;
  public createdAt!: Date;
}

Move.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    gameId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Games',
        key: 'id',
      },
      allowNull: false,
    },
    playerId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Players',
        key: 'id',
      },
      allowNull: false,
    },
    move: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'Moves',
    timestamps: false, 
  }
);

export default Move;
