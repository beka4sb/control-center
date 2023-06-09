import { UserLevel } from './UserLevel';

export class User {
  constructor(private readonly name: string, private readonly level: UserLevel, private readonly changePasswordAllowed: boolean) {}

  getName() {
    return this.name;
  }

  getLevel() {
    return this.level;
  }

  canChangePassword() {
    return this.changePasswordAllowed;
  }

  getFormattedName() {
    return `${this.name} (${this.getLevel()})`;
  }

  isTester(): boolean {
    return this.level === UserLevel.TESTER || this.isAnalyst();
  }

  isAnalyst(): boolean {
    return this.level === UserLevel.ANALYST || this.isAdmin();
  }

  isAdmin(): boolean {
    return this.level === UserLevel.ADMIN || this.isSuperUser();
  }

  isSuperUser(): boolean {
    return this.level === UserLevel.SUPERUSER;
  }

  toRawJson() {
    return {
      name: this.getName(),
      level: this.getLevel(),
      canChangePassword: this.canChangePassword(),
    };
  }
}
