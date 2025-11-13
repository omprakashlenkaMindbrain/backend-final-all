import jwt, { SignOptions } from "jsonwebtoken";
import config from "config";

const secret = config.get<string>("secretKey");

export function signJwt(
  payload: Object,
  options: SignOptions = { expiresIn: "15m" }
) {
  return jwt.sign(payload, secret, options);
}


export function verifyJwt<T = object>(token: string): { decode: T | null; expired: boolean } {
  try {
    const decoded = jwt.verify(token, secret) as T;
    return {
      decode: decoded,
      expired: false,
    };
  } catch (e: any) {
    return {
      decode: null,
      expired: e.message === "jwt expired",
    };
  }
}
