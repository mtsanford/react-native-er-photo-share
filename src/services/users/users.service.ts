
import { User } from "../../infrastructure/types/user.types";

export interface UsersService {
  getUserInfo: (uid: string) => Promise<User>;
}
