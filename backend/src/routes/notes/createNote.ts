import { FastifyPluginAsync } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import ValidateError from "../../interfaces/ValidateError";
import Jwt from "jsonwebtoken";
import Note from "../../models/Note";
import JsonWebTokenObject from "../../interfaces/JsonWebTokenObject";
const Schema = {
  $id: "createNoteSchema",
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
    category: {
      type: "string",
    },
  },
  required: ["noteId", "title", "description", "category"],
  errorMessage: {
    type: "The body type should be an object",
    required: {
      noteId: "The noteId field is missing",
      title: "The title field is missing",
      description: "The description field is missing",
      category: "The category field is missing",
    },
  },
} as const;

const createNoteSchema = {
  body: Schema,
};

const createNoteRoute: FastifyPluginAsync = async (server) => {
  server.post<{ Body: FromSchema<typeof Schema> }>(
    "/notes/createNote",
    {
      schema: createNoteSchema,
      attachValidation: true,
    },
    async (req, res): Promise<void> => {
      try {
        const authToken = req.headers.authorization;
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
        if (!authToken) {
          res.status(400);
          res.send({
            code: 400,
            error: "Unauthorized",
            message: "Authorization header was not provided",
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
        const { body } = req;
        const { noteId, title, description, category } = body;
        const allNotes = await Note.findOne({
          userId: token.user.id,
        });
        if (allNotes) {
          for (const i in allNotes.notes) {
            if (allNotes.notes[i].noteId === noteId) {
              res.code(409);
              res.send({
                code: 409,
                error: "Note with the given id exists",
                message: "The provided noteId already exists on a note",
              });
              return;
            }
          }
          allNotes.notes.push({
            noteId: noteId,
            title: title,
            description: description,
            category: category,
          });
        await allNotes.save()
          res.code(200);
          res.send({
            code: 200,
            message: "Note was created successfully",
          });
          return;
        }
         await Note.create({
          userId: token.user.id,
          notes: [
            {
              noteId: noteId,
              title: title,
              description: description,
              category: category,
            },
          ],
        });
        res.code(200);
        res.send({
          code: 200,
          message: "Note was created successfully",
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
export default createNoteRoute;
