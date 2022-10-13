import mongoose from "mongoose";
import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";

import { createServer } from "../utils/server";
import { createProduct } from "../services/product.service";
import { signJwt } from "../utils/jwt.utils";

const app = createServer();

const userId = new mongoose.Types.ObjectId().toString();

const payload = {
  user: userId,
  title: "NVIDIA RTX 4090 TI",
  description:
    "mnogo qko GPU, mnogo vurvi jalko che habi tok za 100 leva.Iska 50 ventilatora , ama mojesh da igraesh 200 COD igri at a time. liagta pasti da qde na 40k fps vadi faker gi praish s edna ruka i s edno oko. caps nqma da komentiram daje",
  price: 890.0,
  image: "nqma img samo mirishesh",
};

const userPayload = {
  _id: userId,
  email: "testJest@abv.bg",
  name: "TestJest",
};

describe("product", () => {
  //mongo memory server will start an isntance of mongo in memory
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });
  //after tests are done close connectionto mongoose
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  //describe.only(), it.only() -> run only this test
  //describe.skip(), it.skip() -> skip this test

  describe("get product route", () => {
    describe("given the product does not exist", () => {
      it("should return 404", async () => {
        const productId = "prodyct-123";

        await supertest(app).get(`/api/products/${productId}`).expect(404);
      });
    });

    describe("given the product does exist", () => {
      it("should return a 200 status and the product", async () => {
        const product = await createProduct(payload);

        const { body, statusCode } = await supertest(app).get(
          `/api/products/${product.productId}`
        );
        //   .expect(200);
        // console.log(body, product);

        expect(statusCode).toBe(200);
        expect(body.productId).toBe(product.productId);
      });
    });
  });

  describe("create product route", () => {
    describe("given the user is not logged in", () => {
      it("should return a 403", async () => {
        const { body, statusCode } = await supertest(app).post(`/api/products`);
        expect(statusCode).toBe(403);
      });
    });

    describe("given the user is logged in", () => {
      it("should return a 200 and create the product", async () => {
        //having services is great like this and the above example with createProduct()

        const jwt = signJwt(userPayload);

        const { body, statusCode } = await supertest(app)
          .post("/api/products")
          .set("Authorization", `Bearer ${jwt}`)
          .send(payload);

        expect(statusCode).toBe(200);
        expect(body).toEqual({
          __v: 0,
          _id: expect.any(String),
          //here will be dynamic string data , because every time we create a product it will generate different id
          createdAt: expect.any(String),
          description:
            "mnogo qko GPU, mnogo vurvi jalko che habi tok za 100 leva.Iska 50 ventilatora , ama mojesh da igraesh 200 COD igri at a time. liagta pasti da qde na 40k fps vadi faker gi praish s edna ruka i s edno oko. caps nqma da komentiram daje",
          image: "nqma img samo mirishesh",
          price: 890,
          title: "NVIDIA RTX 4090 TI",
          updatedAt: expect.any(String),
          user: expect.any(String),
        });
      });
    });
  });
});
