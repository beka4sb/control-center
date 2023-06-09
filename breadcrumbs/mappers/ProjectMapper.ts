import { Project } from '../models/Project';
import { GQLIdEncoder } from '../../common/utils/GQLIdEncoder';

export class ProjectMapper {
  readonly gqlIdEncoder = new GQLIdEncoder();

  mapGQLModel(data: any): Project {
    const integrations = data.organization?.integrations?.map((i: any) => i.__typename) || [];
    return new Project(data.id, this.gqlIdEncoder.decode(data.id), data.name, integrations);
  }
}
