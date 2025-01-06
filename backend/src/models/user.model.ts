import {Model, DataTypes} from "sequelize";
import sequelize from "../config/database";

export interface UserAttributes {
    id?: number;
    username: string;
    password: string;
    elo: number;
    shareReplays: boolean;
}

export class User
    extends Model<UserAttributes>
    implements UserAttributes {
    public id!: number;
    public username!: string;
    public password!: string;
    public elo!: number;
    public shareReplays!: boolean;
}

User.init(
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
        elo: {
            type: DataTypes.INTEGER,
            defaultValue: 1200,
            allowNull: false,
        },
        shareReplays: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "User",
    },
);
