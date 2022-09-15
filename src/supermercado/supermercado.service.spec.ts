import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SupermercadoEntity } from './supermercado.entity';
import { SupermercadoService } from './supermercado.service';

import { faker } from '@faker-js/faker';

describe('SupermercadoService', () => {
  let service: SupermercadoService;
  let repository: Repository<SupermercadoEntity>;
  let supermercadosList: SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadoService],
    }).compile();

    service = module.get<SupermercadoService>(SupermercadoService);
    repository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    supermercadosList = [];
    for(let i = 0; i < 5; i++){
      const supermercado: SupermercadoEntity = await repository.save({
        nombre: faker.company.name(),
        latitud: parseFloat(faker.address.latitude()),
        longitud: parseFloat(faker.address.longitude()),
        paginaWeb: faker.internet.url()
      })
      supermercadosList.push(supermercado)
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all supermercados', async () => {
    const supermercados: SupermercadoEntity[] = await service.findAll();
    expect(supermercados).not.toBeNull();
    expect(supermercados).toHaveLength(supermercadosList.length);
  });

  it('findOne should return a supermercado by id', async () => {
    const storedSupermercado: SupermercadoEntity = supermercadosList[0];
    const supermercado: SupermercadoEntity = await service.findOne(storedSupermercado.id);
    expect(supermercado).not.toBeNull();
    expect(supermercado.nombre).toEqual(storedSupermercado.nombre)
  });

  it('findOne should throw an exception for an invalid supermercado', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "Supermercado no encontrado")
  });

  it('create should return a new supermercado', async () => {
    const supermercado: SupermercadoEntity = {
      id: "",
      nombre: faker.company.name(),
      latitud: parseFloat(faker.address.latitude()),
      longitud: parseFloat(faker.address.longitude()),
      paginaWeb: faker.internet.url(),
      ciudades: [],
    }

    const newSupermercado: SupermercadoEntity = await service.create(supermercado);
    expect(newSupermercado).not.toBeNull();

    const storedSupermercado: SupermercadoEntity = await repository.findOne({ where: { id: newSupermercado.id } })
    expect(storedSupermercado).not.toBeNull();
    expect(storedSupermercado.nombre).toEqual(newSupermercado.nombre)
    expect(storedSupermercado.latitud).toEqual(newSupermercado.latitud)
    expect(storedSupermercado.longitud).toEqual(newSupermercado.longitud)
    expect(storedSupermercado.paginaWeb).toEqual(newSupermercado.paginaWeb)
  });

  it('update should modify a supermercado', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    supermercado.nombre = "New name";
    supermercado.paginaWeb =  faker.internet.url();

    const updatedSupermercado: SupermercadoEntity = await service.update(supermercado.id, supermercado);
    expect(updatedSupermercado).not.toBeNull();

    const storedSupermercado: SupermercadoEntity = await repository.findOne({ where: { id: supermercado.id } })
    expect(storedSupermercado).not.toBeNull();
    expect(storedSupermercado.nombre).toEqual(supermercado.nombre)
    expect(storedSupermercado.paginaWeb).toEqual(supermercado.paginaWeb)
  });

  it('update should throw an exception for an invalid supermercado', async () => {
    let supermercado: SupermercadoEntity = supermercadosList[0];
    supermercado = {
      ...supermercado, nombre: "New name"
    }
    await expect(() => service.update("0", supermercado)).rejects.toHaveProperty("message", "Supermercado no encontrado")
  });

  it('delete should remove a supermercado', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await service.delete(supermercado.id);

    const deletedSupermercado: SupermercadoEntity = await repository.findOne({ where: { id: supermercado.id } })
    expect(deletedSupermercado).toBeNull();
  });

  it('delete should throw an exception for an invalid supermercado', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await service.delete(supermercado.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "Supermercado no encontrado")
  });
});