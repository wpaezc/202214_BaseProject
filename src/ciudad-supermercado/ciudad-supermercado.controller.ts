import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { SupermercadoDto } from 'src/supermercado/supermercado.dto';
import { SupermercadoEntity } from 'src/supermercado/supermercado.entity';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';

@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadSupermercadoController {
  constructor(private readonly ciudadSupermercadoService: CiudadSupermercadoService) { }

  @Post(':ciudadId/supermarkets/:supermercadoId')
  async addSupermercadoCiudad(@Param('ciudadId') ciudadId: string, @Param('supermercadoId') supermercadoId: string){
      return await this.ciudadSupermercadoService.addSupermarketToCity(ciudadId, supermercadoId);
  }

  @Get(':ciudadId/supermarkets/:supermercadoId')
  async findSupermercadoByCiudadIdSupermercadoId(@Param('ciudadId') ciudadId: string, @Param('supermercadoId') supermercadoId: string){
      return await this.ciudadSupermercadoService.findSupermarketFromCity(ciudadId, supermercadoId);
  }

  @Get(':ciudadId/supermarkets')
  async findSupermercadosByCiudadId(@Param('ciudadId') ciudadId: string){
      return await this.ciudadSupermercadoService.findSupermarketsFromCity(ciudadId);
  }

  @Put(':ciudadId/supermarkets')
  async associateSupermercadosCiudad(@Body() supermercadosDto: SupermercadoDto[], @Param('ciudadId') ciudadId: string){
      const supermercados = plainToInstance(SupermercadoEntity, supermercadosDto)
      return await this.ciudadSupermercadoService.updateSupermarketsFromCity(ciudadId, supermercados);
  }

  @Delete(':ciudadId/supermarkets/:supermercadoId')
  @HttpCode(204)
  async deleteSupermercadoCiudad(@Param('ciudadId') ciudadId: string, @Param('supermercadoId') supermercadoId: string){
      return await this.ciudadSupermercadoService.deleteSupermarketFromCity(ciudadId, supermercadoId);
  }
}
