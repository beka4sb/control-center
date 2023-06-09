import { Project } from './Project';

export class Slot {
  constructor(private readonly uuid: string, private readonly id: number, private readonly name: string, private readonly project: Project) {}

  getUUID(): string {
    return this.uuid;
  }

  getId(): number {
    return this.id;
  }

  getProject(): Project {
    return this.project;
  }

  getLabel(): string {
    return this.name;
  }

  toRawJson() {
    return {
      id: this.uuid,
      name: this.name,
      project: this.project.toRawJson(),
    };
  }
}
