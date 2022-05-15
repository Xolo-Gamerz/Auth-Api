import { FastifyPluginAsync } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import ValidateError from "../interfaces/ValidateError";
import User from "../models/User";
import config from "../config.json";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const Schema = {
  $id: "LoginSchema",
  type: "object",
  properties: {
    email: {
      type: "string",
    },
    password: {
      type: "string",
    },
  },
  required: ["email", "password"],
  errorMessage: {
    type: "The type should be an object",
    required: {
      email: "The email field is missing",
      password: "The password field is missing",
    },
  },
} as const;

const LoginSchema = {
  body: Schema,
};

const validateEmail = (email: string) => {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};
const LoginRoute: FastifyPluginAsync = async (server) => {
  server.put<{ Body: FromSchema<typeof Schema> }>(
    "/login",
    {
      schema: LoginSchema,
      attachValidation: true,
    },
    async (req, res): Promise<void> => {
      try {
        const err: ValidateError = req.validationError?.validation[0];
        if (err) {
          res.status(400);
          res.send({
            code: 400,
            error: "Bad request",
            message: err.message,
          });
          return;
        }
        const { body } = req;
        const { email, password } = body;
        if (!validateEmail(email)) {
          res.code(406);
          res.send({
            code: 406,
            error: "Bad request",
            message: "Provide a valid email",
          });
          return;
        }
        const user = await User.findOne({
          email: email,
        });

        if (!user) {
          res.status(401);
          res.send({
            code: 401,
            error: "Invalid request",
            message: "Invalid credentials",
          });
          return;
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
          res.status(401);
          res.send({
            code: 401,
            error: "Invalid request",
            message: "Invalid credentials",
          });
          return;
        }
        const data = {
          user: {
            id: user.id,
          },
        };
        const JwtSecret = config.JwtToken;
        const authToken = Jwt.sign(data, JwtSecret);
        res.status(200);
        res.send({
          authToken: authToken
        })
      } catch (error) {
        res.code(500);
        res.send({
          code: 500,
          error: "Internal server error",
        });
        console.log(error);
      }
    }
  );
};

export default LoginRoute;
