import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupermercadoEntity } from './supermercado.entity';
import { SupermercadoService } from './supermercado.service';
import { SupermercadoController } from './supermercado.controller';

@Module({
  providers: [SupermercadoService],
  imports: [TypeOrmModule.forFeature([SupermercadoEntity])],
  controllers: [SupermercadoController],
})
export class SupermercadoModule {}
