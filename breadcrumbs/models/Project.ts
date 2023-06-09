import { OrganizationIntegration } from '../../common/enums/OrganizationIntegration';

export class Project {
  constructor(
    private readonly uuid: string,
    private readonly id: number,
    private readonly name: string,
    private readonly integrations: OrganizationIntegration[]
  ) {}

  getUUID(): number {
    return this.id;
  }

  getId(): number {
    return this.id;
  }

  getLabel(): string {
    return this.name;
  }

  getIntegrations(): OrganizationIntegration[] {
    return this.integrations;
  }

  toRawJson() {
    return {
      id: this.uuid,
      name: this.name,
      organization: {
        integrations: this.integrations.map((i: string) => ({ __typename: i })),
      },
    };
  }
}
