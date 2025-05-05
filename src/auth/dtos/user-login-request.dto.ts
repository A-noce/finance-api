import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class UserLoginRequestDTO {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string
}