// board.model.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

type Piece = {
    type: string;
    color: 'white' | 'black';
};

export class Board extends Model {
    public id!: number;
    public gameId!: number;
    public positions!: string;
    public createdAt!: Date;
    public updatedAt!: Date;


    public getPositions(): string[][] {
        return JSON.parse(this.positions);
    }


    public setPositions(positions: string[][]): void {
        this.positions = JSON.stringify(positions);
    }
}

Board.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        gameId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Games',
                key: 'id',
            },
        },
        positions: {
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
        tableName: 'Boards',
        timestamps: true,
    }
);

export default Board;
