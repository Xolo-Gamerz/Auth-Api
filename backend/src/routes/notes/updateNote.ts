import { FastifyPluginAsync } from "fastify";
import Note from "../../models/Note";
import Jwt from "jsonwebtoken";
import JsonWebTokenObject from "../../interfaces/JsonWebTokenObject";
import { FromSchema } from "json-schema-to-ts";
import ValidateError from "../../interfaces/ValidateError";
import findNoteById from "../../Helpers/FindNoteById";
const Schema = {
  $id: "updateNoteSchema",
  type: "object",
  properties: {
    noteId: {
      type: "string",
    },
    title: {
      type: "string",
    },
    description: {
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
const updateNoteSchema = {
  body: Schema,
};

const updateNoteRoute: FastifyPluginAsync = async (server) => {
  server.put<{ Body: FromSchema<typeof Schema> }>(
    "/notes/updateNote",
    {
      schema: updateNoteSchema,
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
          })
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
        const { body } = req as {
          body: {
            [x: string]: unknown;
            noteId: string;
            title?: string | undefined;
            description?: string | undefined;
          };
        };
        const { noteId } = body;
        const userNotes = Notes.notes;
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
        const { title, description } = body;
        if (title) {
          userNotes[noteIndex].title = title;
          await Notes.save();
          res.code(200);
          res.send({
            code: 200,
            message: "Note was updated successfully",
          });
        }
        if (description) {
          userNotes[noteIndex].description = description;
          await Notes.save();
          res.code(200);
          res.send({
            code: 200,
            message: "Note was updated successfully",
          });
        }
        res.code(406);
        res.send({
          code: 406,
          message: "A title or description must be provided to update",
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
export default updateNoteRoute;
