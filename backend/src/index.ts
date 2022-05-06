import Fastify, { FastifyPluginAsync } from "fastify";
import "dotenv/config";
const server = Fastify()
import HomeRoute from "./routes/Home";
const registerPlugin = (plugin : FastifyPluginAsync)=>{
  server.register(plugin)
}
registerPlugin(HomeRoute)

server.listen(process.env.PORT, (err, adress): void => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${adress}`)
});