// piece.model.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Game from './game.model';  // Importer le modèle Game

export class Piece extends Model {
  public id!: number;
  public gameId!: number;
  public type!: string;
  public color!: string;
  public position!: string;
  public isCaptured!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Piece.init(
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
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isCaptured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    tableName: 'Pieces',
    timestamps: false, 
  }
);

export default Piece;
