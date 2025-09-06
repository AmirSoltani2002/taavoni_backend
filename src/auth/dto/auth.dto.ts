import { IsString } from 'class-validator';

export class AuthEmailDto {
    @IsString()
    email: string;
    @IsString()
    password: string;
}

export class AuthNationalDto {
    @IsString()
    nationalNumber: string;
    @IsString()
    password: string;
}