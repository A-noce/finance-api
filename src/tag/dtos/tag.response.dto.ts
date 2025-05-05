import { Expose } from "class-transformer";

export class TagResponseDTO {
    @Expose()
    id: number

    @Expose()
    name: string

    @Expose()
    color: string

    @Expose()
    description: string

    @Expose()
    userCreatorId: number

    @Expose()
    createdAt: string
}