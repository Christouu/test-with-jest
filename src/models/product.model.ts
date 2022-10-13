import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import { IUserDocument } from "./user.model";

//you must extend mongooose.Document to use this interface
//or use typegoose
export interface IProductDocument extends mongoose.Document {
  user: IUserDocument["_id"];
  title: string;
  description: string;
  price: number;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  productId: string;
}

const productSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

const ProductModel = mongoose.model<IProductDocument>("Product", productSchema);

export default ProductModel;
