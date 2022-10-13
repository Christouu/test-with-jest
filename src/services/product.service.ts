import { Omit } from "lodash";
import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import ProductModel, { IProductDocument } from "../models/product.model";

export const createProduct = async (
  input: DocumentDefinition<
    Omit<IProductDocument, "createdAt" | "updatedAt" | "productId">
  >
) => {
  return await ProductModel.create(input);
};

export const findProduct = async (
  query: FilterQuery<IProductDocument>,
  options: QueryOptions = { lean: true }
) => {
  return await ProductModel.findOne(query, {}, options);
};

export const findAndUpdateProduct = async (
  query: FilterQuery<IProductDocument>,
  update: UpdateQuery<IProductDocument>,
  options: QueryOptions
) => {
  return ProductModel.findOneAndUpdate(query, update, options);
};

export const deleteProduct = async (query: FilterQuery<IProductDocument>) => {
  return ProductModel.deleteOne(query);
};
