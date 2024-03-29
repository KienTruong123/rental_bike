import { Count, CountSchema, Filter, FilterExcludingWhere, repository, Where } from '@loopback/repository'
import { del, get, getModelSchemaRef, param, patch, post, put, requestBody, response } from '@loopback/rest'
import { Bike, Bikestatus } from '../models'
import { BikeRepository } from '../repositories'

export class BikeController {
  constructor(
    @repository(BikeRepository)
    public bikeRepository: BikeRepository,
  ) {}

  @post('/bikes')
  @response(200, {
    description: 'Bike model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Bike) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Bike, {
            title: 'NewBike',
            exclude: ['id'],
          }),
        },
      },
    })
    bike: Omit<Bike, 'id'>,
  ): Promise<Bike> {
    return this.bikeRepository.create(bike)
  }

  @get('/bikes/count')
  @response(200, {
    description: 'Bike model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(@param.where(Bike) where?: Where<Bike>): Promise<Count> {
    return this.bikeRepository.count(where)
  }

  @get('/bikes')
  @response(200, {
    description: 'Array of Bike model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Bike, { includeRelations: true }),
        },
      },
    },
  })
  async find(@param.filter(Bike) filter?: Filter<Bike>): Promise<Bike[]> {
    // console.log('abc')
    return this.bikeRepository.find({})
  }

  @get('/bikes/{id}')
  @response(200, {
    description: 'Bike model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Bike, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Bike, { exclude: 'where' }) filter?: FilterExcludingWhere<Bike>,
  ): Promise<Bike> {
    return this.bikeRepository.findById(id, filter)
  }

  @patch('/bikes/{id}')
  @response(204, {
    description: 'Bike PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Bike, { partial: true, exclude: ['id'] }),
        },
      },
    })
    bike: Bike,
  ): Promise<void> {
    await this.bikeRepository.updateById(id, bike)
  }

  @put('/bikes/{id}')
  @response(204, {
    description: 'Bike PUT success',
  })
  async replaceById(@param.path.number('id') id: number, @requestBody() bike: Bike): Promise<void> {
    await this.bikeRepository.replaceById(id, bike)
  }

  @del('/bikes/{id}')
  @response(204, {
    description: 'Bike DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.bikeRepository.deleteById(id)
  } 

  @get('/bikes/{id}/bikestatus', {
    responses: {
      '200': {
        description: 'Bikestatus belonging to Bike',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Bikestatus),
          },
        },
      },
    },
  })
  async getBikestatus(
    @param.path.number('id') id: typeof Bike.prototype.id,
  ): Promise<Bikestatus> {
    return this.bikeRepository.bikestatus(id);
  }
}
