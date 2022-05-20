import { FastifyPluginAsync } from "fastify";
import Jwt from "jsonwebtoken";
import JsonWebTokenObject from "../../interfaces/JsonWebTokenObject";
import Note from "../../models/Note";
const getAllNoteRoute: FastifyPluginAsync = async (server) => {
  server.get("/notes/getAllNote", async (req, res) => {
    try {
      const authToken = req.headers.authorization as string;
      if (!authToken) {
        res.status(400);
        res.send({
          code: 400,
          error: "Unauthorized",
          message: "Authorizaton header was not provided",
        });
        return;
      }
      const token = Jwt.decode(authToken) as JsonWebTokenObject;
      if (!token) {
        res.status(401);
        res.send({
          code: 401,
          error: "Invalid token",
        });
        return;
      }
      const userId = token.user.id;
      const Notes = await Note.findOne({
        userId: userId,
      });
      if (!Notes) {
        res.status(404);
        res.send({
          code: 404,
          error: "Bad request",
          message: "User has no notes",
        });
        return;
      }
      const allNotes = Notes.notes;
      res.code(200);
      res.send({
        code: 200,
        notes: allNotes,
      });
    } catch (error) {
      res.code(500);
      res.send({
        code: 500,
        error: "Internal Server Error",
        message: error.message,
      });
    }
  });
};
export default getAllNoteRoute;