import { omit } from "lodash";
import { Request, Response } from "express";
import { CreateUserInput } from "../schema/user.schema";
import { createUser } from "../services/user.service";
import log from "../utils/logger";

export const createUserHandler = async (
  //put type only for your req.body, 2 {},{} are  1 for params and 1 for res.body
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) => {
  try {
    //call create user service
    const user = await createUser(req.body);
    // const { password, ...otherInfo } = user;
    // return res.send(otherInfo);

    // return res.send(omit(user.toJSON(), "password"));
    return res.json(omit(user, "password"));
  } catch (error: any) {
    log.error(error);
    return res.status(409).send(error.message);
  }
};
