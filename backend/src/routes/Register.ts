import { FastifyPluginAsync } from "fastify";
import User from "../models/User";
import Token from "../models/Token";
const RegisterRoute: FastifyPluginAsync = async (server) => {
  const Schema = {
    $id: "RegisterSchema",
    type: "object",
    properties: {
      name: {
        type: "string",
      },
      email: {
        type: "string",
      },
      password: {
        type: "string",
      },
    },
    required: ["name", "email", "password"],
    errorMessage: {
      type: "The type should be an object",
      required: {
        email: "The email field is missing",
        password: "The password field is missing",
      },
    },
  } as const;
  const RegisterSchema = {
    body: Schema,
  };
};
export default RegisterRoute;
