// move.model.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export class Move extends Model {
    public id!: number;
    public gameId!: number;
    public playerId!: number;
    public fromRow!: number;
    public fromCol!: number;
    public toRow!: number;
    public toCol!: number;
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
        fromRow: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        fromCol: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        toRow: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        toCol: {
            type: DataTypes.INTEGER,
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
