import { BaseGQLService } from '../../common/services/BaseGQLService';
import { GQLIdEncoder, ModelType } from '../../common/utils/GQLIdEncoder';
import { ProfileMapper } from '../mappers/ProfileMapper';
import { ProjectMapper } from '../mappers/ProjectMapper';
import { ReportMapper } from '../mappers/ReportMapper';
import { SlotMapper } from '../mappers/SlotMapper';
import { Profile } from '../models/Profile';
import { Project } from '../models/Project';
import { Report } from '../models/Report';
import { Slot } from '../models/Slot';

const PROJECT_FIELDS = `
id
name
organization {
  integrations {
    __typename
  }
}
`;

export const GET_PROFILE_QUERY = `
query($id: ID!) {
  profile: node(id: $id) {
    ... on Profile {
      id
      name
    }
  }
}
`;

export const GET_PROJECT_QUERY = `
query($id: ID!) {
  project: node(id: $id) {
    ... on Project {
      ${PROJECT_FIELDS}
    }
  }
}
`;

/**
 * TODO(a/1204334300206523): Refactor query to use proper model hierarchy once we move to proper routing patterns
 * e.g. project -> slot -> trace
 */
export const GET_SLOT_QUERY = `
query($id: ID!) {
  slot: node(id: $id) {
    ... on Slot {
      id
      name
      project {
        ${PROJECT_FIELDS}
      }
    }
  }
}
`;

export const GET_REPORT_QUERY = `
query($id: ID!) {
  report: node(id: $id) {
    ... on Report {
      id
      name
      traceType
      slot {
        id
        name
        project {
          ${PROJECT_FIELDS}
        }
      }
    }
  }
}
`;

export class BreadcrumbRepository extends BaseGQLService {
  private profileMapper: ProfileMapper;
  private projectMapper: ProjectMapper;
  private slotMapper: SlotMapper;
  private reportMapper: ReportMapper;
  private gqlIdEncoder: GQLIdEncoder;

  constructor() {
    super();

    this.profileMapper = new ProfileMapper();
    this.projectMapper = new ProjectMapper();
    this.slotMapper = new SlotMapper();
    this.reportMapper = new ReportMapper();
    this.gqlIdEncoder = new GQLIdEncoder();
  }

  async getProfile(profileId: string): Promise<Profile> {
    return await this.query(GET_PROFILE_QUERY, { id: this.gqlIdEncoder.encode(ModelType.Profile, profileId) }, (data) =>
      this.profileMapper.mapGQLModel(data?.profile)
    );
  }

  async getProject(projectId: string): Promise<Project> {
    return await this.query(GET_PROJECT_QUERY, { id: this.gqlIdEncoder.encode(ModelType.Project, projectId) }, (data) =>
      this.projectMapper.mapGQLModel(data.project)
    );
  }

  async getSlot(slotId: string): Promise<Slot> {
    return await this.query(GET_SLOT_QUERY, { id: this.gqlIdEncoder.encode(ModelType.Slot, slotId) }, (data) => this.slotMapper.mapGQLModel(data.slot));
  }

  async getReport(reportId: string): Promise<Report> {
    return await this.query(GET_REPORT_QUERY, { id: this.gqlIdEncoder.encode(ModelType.Report, reportId) }, (data) =>
      this.reportMapper.mapGQLModel(data.report)
    );
  }
}
