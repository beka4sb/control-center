export class Profile {
  constructor(private readonly uuid: string, private readonly id: number, private readonly name: string) {}

  getUUID(): number {
    return this.id;
  }

  getId(): number {
    return this.id;
  }

  getLabel(): string {
    return this.name;
  }

  toRawJson() {
    return { id: this.uuid, name: this.name };
  }
}
