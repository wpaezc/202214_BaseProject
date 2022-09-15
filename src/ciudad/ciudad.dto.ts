import {IsIn, IsInt, IsNotEmpty, IsString} from 'class-validator';
export class CiudadDto {
 @IsString()
 @IsNotEmpty()
 readonly nombre: string;
 
 @IsString()
 @IsIn(["Argentina", "Ecuador", "Paraguay"])
 readonly pais: string;
 
 @IsInt()
 @IsNotEmpty()
 readonly numeroHabitantes: number;
}