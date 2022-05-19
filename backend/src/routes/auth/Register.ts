import { FastifyPluginAsync } from "fastify";
import { compile } from "handlebars";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import User from "../../models/User";
import Token from "../../models/Token";
import bcrypt from "bcrypt";
import validateEmail from "../../Helpers/ValidateEmail";
import { FromSchema } from "json-schema-to-ts";
import ValidateError from "../../interfaces/ValidateError";
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
    type: "The body type should be an object",
    required: {
      name: "The name field is missing",
      email: "The email field is missing",
      password: "The password field is missing",
    },
  },
} as const;
const RegisterSchema = {
  body: Schema,
};
const emailTemplateSource = fs.readFileSync(
  path.join(__dirname, "../../../templates/Email.hbs"),
  "utf-8"
);
const template = compile(emailTemplateSource);
const sendMail = async (email: string, subject: string, html: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      secure: false,
      port: parseInt(process.env.PORT),
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
      },
    });
    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      html: html,
    });
  } catch (error) {
    console.log(error);
  }
};

const RegisterRoute: FastifyPluginAsync = async (server) => {
  server.post<{ Body: FromSchema<typeof Schema> }>(
    "/auth/register",
    {
      schema: RegisterSchema,
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
        const { name, email, password } = body;

        const Email = await User.findOne({
          email: email,
        });
        if (!validateEmail(email)) {
          res.code(406);
          res.send({
            code: 406,
            error: "Bad request",
            message: "Provide a valid email",
          });
          return;
        }
        if (Email) {
          res.status(400);
          res.send({
            code: 409,
            error: "Email is already exists",
            message: "The email is already associated with an account",
          });
          return;
        }
        const Name = await User.findOne({
          name: name,
        });
        if (Name) {
          res.status(409);
          res.send({
            code: 409,
            error: "Name already exists",
            message:
              "The name is already taken, Please choose a different name",
          });
          return;
        }
        if (password.length < 8 || password.length > 16) {
          res.status(400);
          res.send({
            code: 400,
            error: "Password too short or too long",
            message:
              "The password should be of minimum 8 charecters and maximum 16 charecters",
          });
          return;
        }
        const salt = await bcrypt.genSalt(10);
        const securedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
          name: name,
          email: email,
          password: securedPassword,
        });
        const token = await Token.create({
          email: email,
          token: Math.random().toString(36).slice(2, 10),
        });
        const htmlToSend = template({
          name: user.name,
          token: token.token,
          url: `${process.env.ADRESS}/auth/verify/?email=${user.email}&token=${token.token}`,
        });
        await sendMail(
          `${email}`,
          `Verify Email`,
          `${htmlToSend}`
        );
        res.send({
          status: 200,
          message:
            "A verification token has been send to your email, please check your email,",
        });
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
export default RegisterRoute;
