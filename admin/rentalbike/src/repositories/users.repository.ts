import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  BelongsToAccessor,
  HasManyRepositoryFactory,
  HasOneRepositoryFactory,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Users, UserRelations, Role, Rental} from '../models';
import {RoleRepository} from './role.repository';
import {RentalRepository} from './rental.repository';
import {UserCredentials, UserCredentialsRepository} from '@loopback/authentication-jwt';

export type Credentials = {
  email: string;
  password: string;
};

export class UserRepository extends DefaultCrudRepository<
  Users,
  typeof Users.prototype.id,
  UserRelations
> {
  public readonly role: BelongsToAccessor<Role, typeof Users.prototype.id>;

  public readonly rentals: HasManyRepositoryFactory<
    Rental,
    typeof Users.prototype.id
  >;

  public readonly userCredentials: HasOneRepositoryFactory<
    UserCredentials,
    typeof Users.prototype.id
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('RoleRepository')
    protected roleRepositoryGetter: Getter<RoleRepository>,
    @repository.getter('RentalRepository')
    protected rentalRepositoryGetter: Getter<RentalRepository>,
    @repository.getter('UserCredentialsRepository')
    protected userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>
  ) {
    super(Users, dataSource);
    this.userCredentials = this.createHasOneRepositoryFactoryFor(
      'userCredentials',
      userCredentialsRepositoryGetter,
    );
    this.rentals = this.createHasManyRepositoryFactoryFor(
      'rentals',
      rentalRepositoryGetter,
    );
    this.registerInclusionResolver('rentals', this.rentals.inclusionResolver);
    this.role = this.createBelongsToAccessorFor('role', roleRepositoryGetter);
    this.registerInclusionResolver('role', this.role.inclusionResolver);
  }

  async findCredentials(
    id: typeof Users.prototype.id,
  ): Promise<UserCredentials | undefined> {
    try {
      return await this.userCredentials(id).get();
    } catch (err) {
      if (err.code === 'ENTITY_NOT_FOUND') {
        return undefined;
      }
      throw err;
    }
  }
}
