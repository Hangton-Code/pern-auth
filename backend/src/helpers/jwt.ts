import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { APIError } from "./errorHandler";

function signToken(
  payload: object,
  secret_key: string,
  options: SignOptions = {}
): string {
  return jwt.sign(payload, secret_key, options);
}

function verifyToken(token: string, secret_key: string) {
  try {
    return jwt.verify(token, secret_key) as JwtPayload;
  } catch (err) {
    if (err instanceof Error) {
      throw new APIError(`Invalid Token: ${err.message}`, {
        statusCode: 400,
      });
    }

    throw new APIError("JsonWebToken Module Error");
  }
}

export { signToken, verifyToken };
