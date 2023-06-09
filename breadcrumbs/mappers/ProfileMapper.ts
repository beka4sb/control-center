import { Profile } from '../models/Profile';
import { GQLIdEncoder } from '../../common/utils/GQLIdEncoder';

export class ProfileMapper {
  readonly gqlIdEncoder = new GQLIdEncoder();

  mapGQLModel(data: any): Profile {
    return new Profile(data.id, this.gqlIdEncoder.decode(data.id), data.name);
  }
}
