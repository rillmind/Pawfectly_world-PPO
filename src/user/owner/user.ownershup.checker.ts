import { Injectable } from "@nestjs/common";
import { ResourceOwnershipChecker } from "src/auth/interfaces/resource.ownership.checker";

@Injectable()
export class UserOwnershipChecker
  implements ResourceOwnershipChecker<string, string>{
  public checkOwnership(resourceId: string, userId: string): boolean {
    return resourceId == userId;
  }
}
