/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { Repository } from 'typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('CiudadSupermercadoService', () => {
  let service: CiudadSupermercadoService;
  let ciudadRepository: Repository<CiudadEntity>;
  let supermercadoRepository: Repository<SupermercadoEntity>;
  let ciudad: CiudadEntity;
  let supermercadosList : SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadSupermercadoService],
    }).compile();

    service = module.get<CiudadSupermercadoService>(CiudadSupermercadoService);
    ciudadRepository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    supermercadoRepository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    supermercadoRepository.clear();
    ciudadRepository.clear();

    supermercadosList = [];
    for(let i = 0; i < 5; i++){
        const supermercado: SupermercadoEntity = await supermercadoRepository.save({
          nombre: faker.company.name(),
          latitud: parseFloat(faker.address.latitude()),
          longitud: parseFloat(faker.address.longitude()),
          paginaWeb: faker.internet.url()
        })
        supermercadosList.push(supermercado);
    }

    ciudad = await ciudadRepository.save({
      nombre: faker.company.name(),
      pais: "Argentina",
      numeroHabitantes: faker.datatype.number(),
      supermercados: supermercadosList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addSupermercadoCiudad should add an supermercado to a ciudad', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.company.name(),
      latitud: parseFloat(faker.address.latitude()),
      longitud: parseFloat(faker.address.longitude()),
      paginaWeb: faker.internet.url()
    });

    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.company.name(),
      pais: "Argentina",
      numeroHabitantes: faker.datatype.number(),
    })

    const result: CiudadEntity = await service.addSupermercadoCiudad(newCiudad.id, newSupermercado.id);

    expect(result.supermercados.length).toBe(1);
    expect(result.supermercados[0]).not.toBeNull();
    expect(result.supermercados[0].nombre).toBe(newSupermercado.nombre)
  });

  it('addSupermercadoCiudad should thrown exception for an invalid supermercado', async () => {
    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.company.name(),
      pais: "Argentina",
      numeroHabitantes: faker.datatype.number(),
    })

    await expect(() => service.addSupermercadoCiudad(newCiudad.id, "0")).rejects.toHaveProperty("message", "El supermercado con el id dado no ha sido encontrado");
  });

  it('addSupermercadoCiudad should throw an exception for an invalid ciudad', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.company.name(),
      latitud: parseFloat(faker.address.latitude()),
      longitud: parseFloat(faker.address.longitude()),
      paginaWeb: faker.internet.url()
    });

    await expect(() => service.addSupermercadoCiudad("0", newSupermercado.id)).rejects.toHaveProperty("message", "La ciudad con el id dado no ha sido encontrada");
  });

  it('findSupermercadoByCiudadIdSupermercadoId should return supermercado by ciudad', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    const storedSupermercado: SupermercadoEntity = await service.findSupermercadoByCiudadIdSupermercadoId(ciudad.id, supermercado.id, )
    expect(storedSupermercado).not.toBeNull();
    expect(storedSupermercado.nombre).toBe(supermercado.nombre);
  });

  it('findSupermercadoByCiudadIdSupermercadoId should throw an exception for an invalid supermercado', async () => {
    await expect(()=> service.findSupermercadoByCiudadIdSupermercadoId(ciudad.id, "0")).rejects.toHaveProperty("message", "El supermercado con el id dado no ha sido encontrado");
  });

  it('findSupermercadoByCiudadIdSupermercadoId should throw an exception for an invalid ciudad', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0]; 
    await expect(()=> service.findSupermercadoByCiudadIdSupermercadoId("0", supermercado.id)).rejects.toHaveProperty("message", "La ciudad con el id dado no ha sido encontrada"); 
  });

  it('findSupermercadoByCiudadIdSupermercadoId should throw an exception for an supermercado not associated to the ciudad', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.company.name(),
      latitud: parseFloat(faker.address.latitude()),
      longitud: parseFloat(faker.address.longitude()),
      paginaWeb: faker.internet.url()
    });

    await expect(()=> service.findSupermercadoByCiudadIdSupermercadoId(ciudad.id, newSupermercado.id)).rejects.toHaveProperty("message", "El supermercado con el id dado no esta asociado a la ciudad");
  });

  it('findSupermercadosByCiudadId should return supermercados by ciudad', async ()=>{
    const supermercados: SupermercadoEntity[] = await service.findSupermercadosByCiudadId(ciudad.id);
    expect(supermercados.length).toBe(5)
  });

  it('findSupermercadosByCiudadId should throw an exception for an invalid ciudad', async () => {
    await expect(()=> service.findSupermercadosByCiudadId("0")).rejects.toHaveProperty("message", "La ciudad con el id dado no ha sido encontrada");
  });

  it('associateSupermercadosCiudad should update supermercados list for a ciudad', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.company.name(),
      latitud: parseFloat(faker.address.latitude()),
      longitud: parseFloat(faker.address.longitude()),
      paginaWeb: faker.internet.url()
    });

    const updatedCiudad: CiudadEntity = await service.associateSupermercadosCiudad(ciudad.id, [newSupermercado]);
    expect(updatedCiudad.supermercados.length).toBe(1);

    expect(updatedCiudad.supermercados[0].nombre).toBe(newSupermercado.nombre);
    expect(updatedCiudad.supermercados[0].latitud).toBe(newSupermercado.latitud);
  });

  it('associateSupermercadosCiudad should throw an exception for an invalid ciudad', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.company.name(),
      latitud: parseFloat(faker.address.latitude()),
      longitud: parseFloat(faker.address.longitude()),
      paginaWeb: faker.internet.url()
    });

    await expect(()=> service.associateSupermercadosCiudad("0", [newSupermercado])).rejects.toHaveProperty("message", "La ciudad con el id dado no ha sido encontrada");
  });

  it('associateSupermercadosCiudad should throw an exception for an invalid supermercado', async () => {
    const newSupermercado: SupermercadoEntity = supermercadosList[0];
    newSupermercado.id = "0";

    await expect(()=> service.associateSupermercadosCiudad(ciudad.id, [newSupermercado])).rejects.toHaveProperty("message", "El supermercado con el id dado no ha sido encontrado");
  });

  it('deleteSupermercadoToCiudad should remove an supermercado from a ciudad', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    
    await service.deleteSupermercadoCiudad(ciudad.id, supermercado.id);

    const storedCiudad: CiudadEntity = await ciudadRepository.findOne({where: {id: ciudad.id}, relations: ["supermercados"]});
    const deletedSupermercado: SupermercadoEntity = storedCiudad.supermercados.find(a => a.id === supermercado.id);

    expect(deletedSupermercado).toBeUndefined();
  });

  it('deleteSupermercadoToCiudad should thrown an exception for an invalid supermercado', async () => {
    await expect(()=> service.deleteSupermercadoCiudad(ciudad.id, "0")).rejects.toHaveProperty("message", "El supermercado con el id dado no ha sido encontrado");
  });

  it('deleteSupermercadoToCiudad should thrown an exception for an invalid ciudad', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await expect(()=> service.deleteSupermercadoCiudad("0", supermercado.id)).rejects.toHaveProperty("message", "La ciudad con el id dado no ha sido encontrada");
  });

  it('deleteSupermercadoToCiudad should thrown an exception for an non asocciated supermercado', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.company.name(),
      latitud: parseFloat(faker.address.latitude()),
      longitud: parseFloat(faker.address.longitude()),
      paginaWeb: faker.internet.url()
    });

    await expect(()=> service.deleteSupermercadoCiudad(ciudad.id, newSupermercado.id)).rejects.toHaveProperty("message", "El supermercado con el id dado no esta asociado a la ciudad");
  }); 
});