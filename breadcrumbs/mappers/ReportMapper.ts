import { GQLIdEncoder } from '../../common/utils/GQLIdEncoder';
import { Report } from '../models/Report';
import { SlotMapper } from './SlotMapper';

export class ReportMapper {
  readonly gqlIdEncoder = new GQLIdEncoder();
  readonly slotBreadcrumbMapper = new SlotMapper();

  mapGQLModel(data: any): Report {
    return new Report(data.id, this.gqlIdEncoder.decode(data.id), data.name, data.traceType, this.slotBreadcrumbMapper.mapGQLModel(data.slot));
  }
}
