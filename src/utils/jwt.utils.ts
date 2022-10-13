import config from "config";
import jwt from "jsonwebtoken";

const publicKey = config.get<string>("publicKey");
const privateKey = config.get<string>("privateKey");

export const signJwt = (
  object: Object, //jwt payload
  options?: jwt.SignOptions | undefined
) => {
  return jwt.sign(object, privateKey, {
    ...(options && options), //if options is not undefined, spread them
    algorithm: "RS256",
  });
};

export const verifyJwt = (token: string) => {
  try {
    const decoded = jwt.verify(token, publicKey);

    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (error: any) {
    return {
      valid: false,
      expired: error.message === "jwt expired",
      decoded: null,
    };
  }
};
