import { server, port } from './config/server';

server.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
});