import { FastifyPluginAsync } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import Jwt from "jsonwebtoken";
import deleteNoteById from "../../Helpers/DeleteNoteById";
import findNoteById from "../../Helpers/FindNoteById";
import JsonWebTokenObject from "../../interfaces/JsonWebTokenObject";
import ValidateError from "../../interfaces/ValidateError";
import Note from "../../models/Note";
const Schema = {
  $id: "deleteNoteSchema",
  type: "object",
  properties: {
    noteId: {
      type: "string",
    },
  },
  required: ["noteId"],
  errorMessage: {
    type: "The body type should be an object",
    required: {
      noteId: "The noteId field is missing",
    },
  },
} as const;
const deleteNoteSchema = {
  body: Schema,
};

const deleteNoteRoute: FastifyPluginAsync = async (server) => {
  server.put<{ Body: FromSchema<typeof Schema> }>(
    "/notes/deleteNote",
    {
      schema: deleteNoteSchema,
      attachValidation: true,
    },
    async (req, res) => {
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
          res.code(401);
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
          res.code(404);
          res.send({
            code: 404,
            error: "Bad request",
            message: "User has no notes",
          });
          return;
        }
        const { body } = req;
        const { noteId } = body;
        let userNotes = Notes.notes;
        const noteIndex = findNoteById(userNotes, noteId);
        if (noteIndex === -1) {
          res.code(404);
          res.send({
            code: 404,
            error: "Bad request",
            message: "Note does not exist",
          });
          return;
        }
        Notes.notes = deleteNoteById(userNotes, noteIndex);
        await Notes.save();
        res.code(200);
        res.send({
          code: 200,
          message: "Note deleted successfully",
        });
      } catch (error) {
        res.code(500);
        res.send({
          code: 500,
          error: "Internal Server Error",
          message: error.message,
        });
      }
    }
  );
};
export default deleteNoteRoute;
