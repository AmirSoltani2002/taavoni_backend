import { IsString, IsEnum, IsDate, IsPhoneNumber, IsNumber, Min, IsEmail, IsNotEmpty, IsOptional } from "class-validator";
export class CreateUserDto {
    @IsString()
    name: string;
    @IsString()
    @IsNotEmpty({'message': 'Last name is required'})
    lastName: string;
    @IsEnum(['male', 'female'])
    @IsNotEmpty()
    sex: 'male'|'female'
    @IsDate()
    @IsNotEmpty()
    birthDay: Date
    @IsString()
    @IsNotEmpty()
    address: string;
    @IsPhoneNumber('IR')
    @IsNotEmpty()
    homePhone: string;
    @IsPhoneNumber('IR')
    @IsNotEmpty()
    mobile: string;
    @IsPhoneNumber('IR')
    @IsNotEmpty()
    workPhone: string;
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @IsString()
    @IsNotEmpty({message: 'National number is required'})
    nationalNumber: string;
    nationalCard: string;
    @IsEnum(['admin', 'tehranUni', 'otherUni', 'free', 'employee'])
    @IsNotEmpty()
    type: 'admin'|'tehranUni'|'otherUni'|'free'|'employee';
    @IsEnum(['val10_15','val15_20','val20_plus'])
    @IsOptional()
    isargaryPercent?: 'val10_15'|'val15_20'|'val20_plus';
    @IsNumber()
    @IsOptional()
    @Min(0)
    azadeEsaratMonths?: number;
    @IsNumber()
    @IsOptional()
    @Min(0)
    azadeMonths?: number;
    @IsNumber()
    @IsOptional()
    @Min(0)
    shahedFamilyNumber?: number;
    @IsEnum(['azade_wife', 'azade_child', 'jan_wife', 'jan_child'])
    @IsOptional()
    shahedRelation?: 'azade_wife'|'azade_child'|'jan_wife'|'jan_child';
}