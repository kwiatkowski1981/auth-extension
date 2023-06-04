import { ActiveUserData } from '../../interfaces/active-user-data.interface';
import { Policy } from './interfaces/policy.interface';
import { Injectable, Logger } from '@nestjs/common';
import { PolicyHandler } from './interfaces/policy-handler.interface';
import { PolicyHandlerStorage } from './policy-handlers.storage';

export class MinimumAgePolicy implements Policy {
  name = 'MinimumAge';
  age: number;
  constructor(age: number) {
    this.age = age;
  }
}

@Injectable()
export class MinimumAgePolicyHandler
  implements PolicyHandler<MinimumAgePolicy>
{
  private readonly logger = new Logger(MinimumAgePolicy.name); // Logger
  constructor(private readonly policyHandlerStorage: PolicyHandlerStorage) {
    this.policyHandlerStorage.add(MinimumAgePolicy, this);
  }

  async handle(policy: MinimumAgePolicy, user: ActiveUserData): Promise<void> {
    this.logger.debug(
      `Policy ${policy.name} created with age ${policy.age} and given user Age is ${user.age}`,
    );
    const isOldEnough = user.age >= policy.age;
    if (!isOldEnough) {
      throw new Error(
        `User is not older than ${policy.age} years. User age is ${user.age}`,
      );
    }
  }
}
