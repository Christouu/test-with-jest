import { get } from "lodash";
import { FilterQuery, UpdateQuery } from "mongoose";
import config from "config";
import SessionModel, { ISessionDocument } from "../models/session.model";
import { signJwt, verifyJwt } from "../utils/jwt.utils";
import { findUseras } from "./user.service";

export const createSession = async (userId: string, userAgent: string) => {
  const session = await SessionModel.create({ user: userId, userAgent });

  return session.toJSON();
};

export const findSessions = async (query: FilterQuery<ISessionDocument>) => {
  return SessionModel.find(query).lean();
};

export const updateSession = async (
  query: FilterQuery<ISessionDocument>,
  update: UpdateQuery<ISessionDocument>
) => {
  return SessionModel.updateOne(query, update);
};

export const reIssueAccessToken = async ({
  refreshToken,
}: {
  refreshToken: string;
}) => {
  const { decoded } = verifyJwt(refreshToken);

  if (!decoded || !get(decoded, "session")) return false;

  const session = await SessionModel.findById(get(decoded, "session"));

  if (!session || !session.valid) return false;

  const user = await findUseras({ _id: session.user });

  if (!user) return false;

  const accessToken = signJwt(
    {
      ...user,
      session: session._id,
    },
    { expiresIn: config.get("accessTokenTtl") }
  );

  return accessToken;
};
