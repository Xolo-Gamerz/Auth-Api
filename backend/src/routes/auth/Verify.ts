import { FastifyPluginAsync, FastifyRequest } from "fastify";
import Jwt from "jsonwebtoken";
import config from "../../config.json";
import User from "../../models/User";
import Token from "../../models/Token";
const Schema = {
  $id: "VerifySchema",
  type: "object",
  properties: {
    res: {
      type: "string",
      properties: {
        email: { type: "string" },
        token: { type: "string" },
      },
      required: ["email", "token"],
      errorMessage: {
        required: {
          email: "The email query is missing",
          token: "The token query is missing",
        },
      },
    },
  },
};

type Query = {
  res: {
    email: string;
    token: string;
  };
};

type QueryBody = {
  email: string;
  token: string;
};

const QuerySchema = {
  querystring: Schema,
};
const VerifyRoute: FastifyPluginAsync = async (server) => {
  server.get(
    "/auth/verify/:params",
    {
      schema: QuerySchema,
    },
    async (req: FastifyRequest<{ Querystring: Query }>, res) => {
      try {
        const { query } = req;
        const parsedQuery: QueryBody = JSON.parse(JSON.stringify(query));
        const { email, token } = parsedQuery;
        const userToken = await Token.findOne({
          email: email,
        });
        const userVerified = await User.findOne({
          email: email
        })
        if(userVerified?.verified){
          res.code(400)
          res.send({
            code:400,
            error: "The email already verified",
            message:"The email provided is already verified"
          })
          return;
        }
        if (!userToken) {
          res.code(400);
          res.send({
            code: 400,
            error: "Email not available",
            message:
              "The email provided is either not registered or the token has expired",
          });
          return;
        }

        if (userToken.token !== token) {
          res.code(401);
          res.send({
            code: 401,
            error: "Invalid token",
            message:
              "The token provided was invalid, please check the desired email",
          });
          return;
        }
        if (userToken.token === token) {
          res.code(200);
          const user = await User.findOne({
            email: email,
          });
          await user?.updateOne({
            verified: true,
          });
          const data = {
            user: {
              id: user?.id,
            },
          };
          const JwtSecret = config.JwtToken;
          const authToken = Jwt.sign(data, JwtSecret);
          res.code(200);
          res.send({
            code: 200,
            authToken: authToken,
          });
          await userToken.deleteOne()
        }
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
export default VerifyRoute;
