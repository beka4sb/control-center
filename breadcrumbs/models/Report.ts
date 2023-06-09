import { TraceType } from '../../common/enums/TraceType';
import { Slot } from './Slot';

export class Report {
  constructor(
    private readonly uuid: string,
    private readonly id: number,
    private readonly name: string,
    private readonly traceType: TraceType,
    private readonly slot: Slot
  ) {}

  getUUID(): string {
    return this.uuid;
  }

  getId(): number {
    return this.id;
  }

  getLabel(): string {
    return this.name;
  }

  getTraceType(): TraceType {
    return this.traceType;
  }

  getSlot(): Slot {
    return this.slot;
  }

  toRawJson() {
    return {
      id: this.uuid,
      name: this.name,
      traceType: this.traceType,
      slot: this.slot.toRawJson(),
    };
  }
}
