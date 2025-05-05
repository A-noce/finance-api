import { Expose } from "class-transformer";

export class UserResponseDTO {
    @Expose()
    email: string

    @Expose()
    createdAt: string
}