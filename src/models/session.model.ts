import mongoose from "mongoose";
import { IUserDocument } from "./user.model";

//you must extend mongooose.Document to use this interface
//or use typegoose
export interface ISessionDocument extends mongoose.Document {
  user: IUserDocument["_id"]; // take the id from user schema
  valid: Boolean;
  userAgent: String;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, //ref our user model
    valid: { type: Boolean, default: true },
    userAgent: { type: String }, // use this prop to tell user that he logged in on X date with Y browser
  },
  { timestamps: true }
);

const SessionModel = mongoose.model<ISessionDocument>("Session", sessionSchema);

export default SessionModel;
