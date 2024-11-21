// player.model.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export class player extends Model {
  public id!: number;
  public username!: string;
  public password!: string;
  public email!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

player.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
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
    tableName: 'Players',
    timestamps: false, 
  }
);

export default player;
