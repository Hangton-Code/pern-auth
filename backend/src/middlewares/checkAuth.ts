import { Request, Response, NextFunction } from "express";
import { APIError, use } from "../helpers/errorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getUserById } from "../services/dbUsers";

const checkAuth = use(
  async (req: Request, res: Response, next: NextFunction) => {
    const beareredToken = req.headers["authorization"];
    const access_token = beareredToken ? beareredToken.split(" ")[1] : null;

    if (!access_token)
      throw new APIError("Unauthorized", {
        statusCode: 401,
      });

    let id: string = "";

    // verifiy token and get the id from it
    try {
      id = (
        jwt.verify(
          access_token,
          process.env.JWT_ACCESS_TOKEN_SECRET_KEY as string
        ) as JwtPayload
      ).id;
    } catch (err) {
      if (err instanceof Error)
        throw new APIError(`Unauthorized (Invalid Token): ${err.message}`, {
          statusCode: 401,
          body: {
            invalidToken: true,
          },
        });
    }

    // check if user exist
    const user = await getUserById(id);
    if (!user)
      throw new APIError("Unauthorized (User Does Not Exist)", {
        statusCode: 401,
      });

    req.user = user;

    next();
  }
);

export default checkAuth;
