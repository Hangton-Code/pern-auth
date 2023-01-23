import { IUser } from "../type";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}
