import config from "config";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

//you must extend mongooose.Document to use this interface
//or use typegoose
export interface IUserDocument extends mongoose.Document {
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  let user = this as IUserDocument;

  if (!user.isModified("password")) {
    return next();
  }

  //if password is modified
  const salt = await bcrypt.genSalt(config.get<number>("salt"));
  const hash = await bcrypt.hash(user.password, salt);

  user.password = hash;

  return next();
});

//compare hashed password with normal password when registering in
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as IUserDocument;

  return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};

const UserModel = mongoose.model<IUserDocument>("User", userSchema);

export default UserModel;
