import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Type,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUEST_USER_KEY } from '../../iam.constants';
import { ActiveUserData } from '../../interfaces/active-user-data.interface';
import { POLICIES_KEY } from '../decorators/policies.decorator';
import { Policy } from '../policies/interfaces/policy.interface';
import { PolicyHandlerStorage } from '../policies/policy-handlers.storage';

@Injectable()
export class PoliciesGuard implements CanActivate {
  private readonly logger = new Logger(PoliciesGuard.name); // Logger
  constructor(
    private readonly reflector: Reflector,
    private readonly policyHandlerStorage: PolicyHandlerStorage,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policies = this.reflector.getAllAndOverride<Policy[]>(POLICIES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    this.logger.debug(policies);
    if (policies) {
      const user: ActiveUserData = context.switchToHttp().getRequest()[
        REQUEST_USER_KEY
      ];
      await Promise.all(
        policies.map((policy) => {
          const policyHandler = this.policyHandlerStorage.get(
            policy.constructor as Type,
          );
          return policyHandler.handle(policy, user);
        }),
      ).catch((err) => {
        throw new ForbiddenException(err.message);
      });
    }
    return true;
  }
}
