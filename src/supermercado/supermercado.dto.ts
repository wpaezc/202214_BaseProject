import {IsNotEmpty, IsNumber, IsNumberString, IsString, IsUrl} from 'class-validator';
export class SupermercadoDto {
 @IsString()
 @IsNotEmpty()
 readonly nombre: string;
 
 @IsUrl()
 @IsNotEmpty()
 readonly paginaWeb: string;
 
 @IsNumberString()
 @IsNotEmpty()
 readonly latitud: string;

 @IsNumberString()
 @IsNotEmpty()
 readonly longitud: string;
}