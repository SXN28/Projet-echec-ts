export interface PlayerInputDTO {
    username: string;
    email: string;
    password: string;
}

export interface PlayerInputPatchDTO {
    username?: string;
    email?: string;
    password?: string;
}

export interface PlayerOutputDTO {
    id: number;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}
