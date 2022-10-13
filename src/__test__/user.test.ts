import mongoose from "mongoose";
import supertest from "supertest";
import { createServer } from "../utils/server";
import * as UserService from "../services/user.service";
import * as SessionService from "../services/session.service";
import { createUserSessionHandler } from "../controllers/session.controller";

const app = createServer();
const userId = new mongoose.Types.ObjectId().toString();
const userPayload = {
  _id: userId,
  email: "jestExample@abv.bg",
  name: "jest example",
};

//create a sample data that you can test your functionalities
const userInput = {
  email: "testwithjest@abv.bg",
  name: "Test with Jest",
  password: "password12345",
  passwordConfirmation: "password12345",
};
//returned a session from mongo
const sessionPayload = {
  _id: new mongoose.Types.ObjectId().toString(),
  user: userId,
  valid: true,
  userAgent: "PostmanRuntime/7.29.2",
  createdAt: new Date("2022-10-11T13:15:24.559+00:00,"),
  updatedAt: new Date("2022-10-11T13:15:24.559+00:00"),
  __v: 0,
};

describe("user", () => {
  //user registration

  //we have to work with clean mocks
  //soo we can add beforeEach and aftereach a clean up but there is a better way :
  //clearMocks in jest.config: true
  //resetMocks in jest.config: true
  //restoreMocks in jest.config: true

  describe("user registration", () => {
    describe("given the username and password are valid", () => {
      it("should return the user payload", async () => {
        //takes 2 params, 1st is the object we want to spy on , 2nd is the property(function) of the object we want to spy on
        const createUserServiceMock = jest
          .spyOn(UserService, "createUser")
          //@ts-ignore
          .mockReturnValueOnce(userPayload); //mock out the return payload. This is the expected to be return from /api/users

        const { body, statusCode } = await supertest(app)
          .post("/api/users/")
          .send(userInput);

        expect(statusCode).toBe(200);
        expect(body).toEqual(userPayload);
        expect(createUserServiceMock).toHaveBeenCalledWith(userInput);
      });
    });

    describe("given the passwords do not match", () => {
      it("should return a 400", async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, "createUser")
          //@ts-ignore
          .mockReturnValueOnce(userPayload);

        const { body, statusCode } = await supertest(app)
          .post("/api/users/")
          .send({ ...userInput, passwordConfirmation: "doesnotmatch" });

        expect(statusCode).toBe(400);
        expect(createUserServiceMock).not.toHaveBeenCalled();
      });
    });
  });

  describe("given the user service throws", () => {
    it("should return a 409", async () => {
      const createUserServiceMock = jest
        .spyOn(UserService, "createUser")
        //@ts-ignore
        .mockRejectedValueOnce("something happend");
      //here we mock a rejection rather than succession like the above test

      const { statusCode } = await supertest(app)
        .post("/api/users/")
        .send(userInput);

      expect(statusCode).toBe(409);
      expect(createUserServiceMock).toHaveBeenCalled(); //we are calling here service because it needs to be called to reject a value
    });
  });

  describe("create user session", () => {
    describe("given the username and password are valid", () => {
      it("should return a signed access token and refresh token", async () => {
        jest
          .spyOn(UserService, "validatePassword")
          //@ts-ignore
          .mockReturnValue(userPayload);

        jest
          .spyOn(SessionService, "createSession")
          //@ts-ignore
          .mockReturnValue(sessionPayload);

        const req = {
          get: () => {
            return "a user agent";
          },
          body: {
            email: "jestexample@abv.bg",
            password: "password12345",
          },
        };

        const send = jest.fn();
        const res = {
          send,
        };

        //@ts-ignore -> those ignores are because req doesnt match the types for Request from express and I cant find a solution for that
        await createUserSessionHandler(req, res);

        expect(send).toHaveBeenCalledWith({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        });
      });
    });
  });
});
