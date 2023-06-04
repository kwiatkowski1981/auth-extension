import { Injectable, Logger } from '@nestjs/common';
import { Policy } from './interfaces/policy.interface';
import { PolicyHandler } from './interfaces/policy-handler.interface';
import { PolicyHandlerStorage } from './policy-handlers.storage';
import { ActiveUserData } from '../../interfaces/active-user-data.interface';

export class OnlyAdminPolicy implements Policy {
  name = 'IsAdminPolicy';
}

@Injectable()
export class OnlyAdminPolicyHandler implements PolicyHandler<OnlyAdminPolicy> {
  private readonly logger = new Logger(OnlyAdminPolicy.name); // Logger
  constructor(private readonly policyHandlerStorage: PolicyHandlerStorage) {
    this.policyHandlerStorage.add(OnlyAdminPolicy, this);
  }

  async handle(policy: OnlyAdminPolicy, user: ActiveUserData): Promise<void> {
    this.logger.debug(
      `Policy ${policy.name} checks if the User ${user.role} is an Administrator.`,
    );
    const isAdmin = user.role.includes('admin');
    if (!isAdmin) {
      throw new Error(`User can not entry as a ${user.role} User.`);
    }
  }
}
