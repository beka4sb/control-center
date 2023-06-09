import { CacheService } from '../../common/services/CacheService';
import { GQLIdEncoder, ModelType } from '../../common/utils/GQLIdEncoder';
import { ProfileMapper } from '../mappers/ProfileMapper';
import { ProjectMapper } from '../mappers/ProjectMapper';
import { ReportMapper } from '../mappers/ReportMapper';
import { SlotMapper } from '../mappers/SlotMapper';
import { Profile } from '../models/Profile';
import { Project } from '../models/Project';
import { Report } from '../models/Report';
import { Slot } from '../models/Slot';

/** TODO(a/1204334300206520): Delete this service and references to it once we are fully migrated to SPA */

/** Generic type for a ModelMapper mapping function e.g. SlotBreadcrumbMapper.mapGQLModel  */
type MapperFunction<Model> = (data: any) => Model;

/** Id of the model, can be the nodeId, passed in from URL params as string or from a model getter as a number */
type Id = string | number;

export class BreadcrumbCachingService {
  private readonly cacheService: CacheService;
  private readonly gqlIdEncoder: GQLIdEncoder;
  private readonly projectBreadcrumbMapper: ProjectMapper;
  private readonly profileBreadcrumbMapper: ProfileMapper;
  private readonly slotBreadcrumbMapper: SlotMapper;
  private readonly reportBreadcrumbMapper: ReportMapper;

  constructor() {
    this.cacheService = new CacheService();
    this.gqlIdEncoder = new GQLIdEncoder();
    this.projectBreadcrumbMapper = new ProjectMapper();
    this.profileBreadcrumbMapper = new ProfileMapper();
    this.slotBreadcrumbMapper = new SlotMapper();
    this.reportBreadcrumbMapper = new ReportMapper();
  }

  /**
   * Formats model's nodeId to a cacheKey in the following format "breadcrumb.{modelNodeId}".
   * @param {string | number} id - encoded nodeId
   * @returns {string}
   */
  private getCacheId(id: string): string {
    return `breadcrumb.${id}`;
  }

  /**
   * Generic model caching handler
   * @param {ModelType} type - Enum for getting model type name
   * @param {MapperFunction<Model>} mapperFunction - Maps cached data to Model
   * @param {string | number} id - id, can be in either encoded or non-encoded form
   * @returns {Model | null}
   */
  private getCachedModel<Model>(type: ModelType, mapperFunction: MapperFunction<Model>, id?: Id): Model | null {
    try {
      if (!id) throw null;

      const data = this.cacheService.getItem(this.getCacheId(this.gqlIdEncoder.encode(type, id)));

      if (!data) return null;

      return mapperFunction(data);
    } catch (e) {
      return null;
    }
  }

  /**
   * Generic breadcrumb cache setter for uniform cache keys.
   * @param {string} id - encoded nodeId
   * @param {any} rawJson - raw json data to store
   * @returns {void}
   */
  private setCachedModel(id: string, rawJson: any) {
    this.cacheService.setItem(this.getCacheId(id), rawJson);
  }

  /**
   * Retrieves ProfileBreadcrumb from cache
   * @param {Id} id - ProfileBreadcrumb id, can be in either encoded or non-encoded form
   * @returns {Profile | null}
   */
  getProfile(id?: Id): null | Profile {
    return this.getCachedModel<Profile>(ModelType.Profile, (data) => this.profileBreadcrumbMapper.mapGQLModel(data), id);
  }

  /**
   * Saves ProfileBreadcrumb to cache
   * @param {Profile | null}
   * @returns {void}
   */
  saveProfile(model: Profile) {
    const rawData = model.toRawJson();

    this.setCachedModel(rawData.id, rawData);
  }

  /**
   * Retrieves ProjectBreadcrumb from cache
   * @param {Id} id - ProjectBreadcrumb id, can be in either encoded or non-encoded form
   * @returns {Project | null}
   */
  getProject(id?: Id): null | Project {
    return this.getCachedModel<Project>(ModelType.Project, (data) => this.projectBreadcrumbMapper.mapGQLModel(data), id);
  }

  /**
   * Saves ProjectBreadcrumb to cache
   * @param {Project | null}
   * @returns {void}
   */
  saveProject(model: Project) {
    const rawData = model.toRawJson();

    this.setCachedModel(rawData.id, rawData);
  }

  /**
   * Retrieves Slot from cache
   * @param {Id} id - Slot id, can be in either encoded or non-encoded form
   * @returns {Slot | null}
   */
  getSlot(id?: Id): null | Slot {
    return this.getCachedModel<Slot>(ModelType.Slot, (data) => this.slotBreadcrumbMapper.mapGQLModel(data), id);
  }

  /**
   * Saves Slot to cache
   * @param {Slot | null}
   * @returns {void}
   */
  saveSlot(model: Slot) {
    const rawData = model.toRawJson();

    this.setCachedModel(rawData.id, rawData);
  }

  /**
   * Retrieves ReportBreadcrumb from cache
   * @param {Id} id - ReportBreadcrumb id, can be in either encoded or non-encoded form
   * @returns {Report | null}
   */
  getReport(id?: Id): null | Report {
    return this.getCachedModel<Report>(ModelType.Report, (data) => this.reportBreadcrumbMapper.mapGQLModel(data), id);
  }

  /**
   * Saves ReportBreadcrumb to cache
   * @param {Report | null}
   * @returns {void}
   */
  saveReport(model: Report) {
    const rawData = model.toRawJson();

    this.setCachedModel(rawData.id, rawData);
  }
}
