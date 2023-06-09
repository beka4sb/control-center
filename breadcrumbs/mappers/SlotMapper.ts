import { Slot } from '../models/Slot';
import { ProjectMapper } from './ProjectMapper';
import { GQLIdEncoder } from '../../common/utils/GQLIdEncoder';

export class SlotMapper {
  readonly projectBreadcrumbMapper = new ProjectMapper();
  readonly gqlIdEncoder = new GQLIdEncoder();

  mapGQLModel(data: any): Slot {
    return new Slot(data.id, this.gqlIdEncoder.decode(data.id), data.name, this.projectBreadcrumbMapper.mapGQLModel(data.project));
  }
}
