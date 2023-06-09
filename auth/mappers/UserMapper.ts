import { User } from '../models/User';
import { UserLevel } from '../models/UserLevel';

export class UserMapper {
  mapRESTModel(data: any): User {
    return new User(data.name, data.role.toLocaleUpperCase() as UserLevel, data.canChangePassword);
  }

  mapGQLModel(data: any): User {
    return new User(data.name, data.level, data.canChangePassword);
  }
}
