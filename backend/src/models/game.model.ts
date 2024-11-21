// game.model.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Player from './player.model';  // Importer le modèle Player

export class Game extends Model {
  public id!: number;
  public whitePlayerId!: number;
  public blackPlayerId!: number;
  public status!: string;
  public turn!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Game.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    whitePlayerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    blackPlayerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    turn: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'Games',
    timestamps: false, 
  }
);

export default Game;
