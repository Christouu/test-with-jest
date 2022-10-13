import { omit } from "lodash";
import { DocumentDefinition, FilterQuery } from "mongoose";
import UserModel, { IUserDocument } from "../models/user.model";

export const createUser = async (
  //omit these 2 propertiers because we dont need to pass them to this function
  input: DocumentDefinition<
    Omit<IUserDocument, "createdAt" | "updatedAt" | "comparePassword">
  >
) => {
  try {
    const user = await UserModel.create(input);
    return omit(user.toJSON(), "password");
  } catch (error: any) {
    throw new Error(error);
  }
};

export const validatePassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const user = await UserModel.findOne({ email });

  if (!user) return false;

  const isValid = await user.comparePassword(password);

  if (!isValid) return false;

  return omit(user.toJSON(), "password");
};

export const findUseras = async (query: FilterQuery<IUserDocument>) => {
  return UserModel.findOne(query).lean();
};
