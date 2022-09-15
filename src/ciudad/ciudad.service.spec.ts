/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CiudadEntity } from './ciudad.entity';
import { CiudadService } from './ciudad.service';

import { faker } from '@faker-js/faker';

describe('CiudadService', () => {
  let service: CiudadService;
  let repository: Repository<CiudadEntity>;
  let ciudadesList: CiudadEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadService],
    }).compile();

    service = module.get<CiudadService>(CiudadService);
    repository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    ciudadesList = [];
    for(let i = 0; i < 5; i++){
      const ciudad: CiudadEntity = await repository.save({
        nombre: faker.company.name(),
        pais: "Argentina",
        numeroHabitantes: faker.datatype.number(),
      })
      ciudadesList.push(ciudad)
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all ciudades', async () => {
    const ciudades: CiudadEntity[] = await service.findAll();
    expect(ciudades).not.toBeNull();
    expect(ciudades).toHaveLength(ciudadesList.length);
  });

  it('findOne should return a ciudad by id', async () => {
    const storedCiudad: CiudadEntity = ciudadesList[0];
    const ciudad: CiudadEntity = await service.findOne(storedCiudad.id);
    expect(ciudad).not.toBeNull();
    expect(ciudad.nombre).toEqual(storedCiudad.nombre)
  });

  it('findOne should throw an exception for an invalid ciudad', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "Ciudad no encontrada")
  });

  it('create should return a new ciudad', async () => {
    const ciudad: CiudadEntity = {
      id: "",
      nombre: faker.company.name(),
      pais: "Ecuador",
      numeroHabitantes: faker.datatype.number(),
      supermercados: [],
    }

    const newCiudad: CiudadEntity = await service.create(ciudad);
    expect(newCiudad).not.toBeNull();

    const storedCiudad: CiudadEntity = await repository.findOne({ where: { id: newCiudad.id } })
    expect(storedCiudad).not.toBeNull();
    expect(storedCiudad.nombre).toEqual(newCiudad.nombre)
    expect(storedCiudad.pais).toEqual(newCiudad.pais)
    expect(storedCiudad.numeroHabitantes).toEqual(newCiudad.numeroHabitantes)
  });

  it('update should modify a ciudad', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];
    ciudad.nombre = "New name";
    ciudad.pais = "Paraguay";

    const updatedCiudad: CiudadEntity = await service.update(ciudad.id, ciudad);
    expect(updatedCiudad).not.toBeNull();

    const storedCiudad: CiudadEntity = await repository.findOne({ where: { id: ciudad.id } })
    expect(storedCiudad).not.toBeNull();
    expect(storedCiudad.nombre).toEqual(ciudad.nombre)
    expect(storedCiudad.pais).toEqual(ciudad.pais)
  });

  it('update should throw an exception for an invalid ciudad', async () => {
    let ciudad: CiudadEntity = ciudadesList[0];
    ciudad = {
      ...ciudad, nombre: "New name", pais: "Paraguay"
    }
    await expect(() => service.update("0", ciudad)).rejects.toHaveProperty("message", "Ciudad no encontrada")
  });

  it('delete should remove a ciudad', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];
    await service.delete(ciudad.id);

    const deletedCiudad: CiudadEntity = await repository.findOne({ where: { id: ciudad.id } })
    expect(deletedCiudad).toBeNull();
  });

  it('delete should throw an exception for an invalid ciudad', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];
    await service.delete(ciudad.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "Ciudad no encontrada")
  });
});