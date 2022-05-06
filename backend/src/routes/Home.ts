import { FastifyPluginAsync } from "fastify";
const HomeRoute: FastifyPluginAsync= async (server) => {
  server.get("/", async (req, res) => {
    res.code(303);
    res.send({ error: `Please redirect to a different route` });
    return;
  });
};
export default HomeRoute