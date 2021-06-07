import { ApolloServer } from 'apollo-server-micro';
import Cors from 'micro-cors';
import { typeDefs } from './schemas';
import { resolvers } from './resolvers';

const cors = Cors();

const apolloServer = new ApolloServer({ typeDefs, resolvers });

export const config = {
  api: {
    bodyParser: false,
  },
};

//const handler = apolloServer.createHandler({ path: '/api/graphql' });

export default cors((req, res) => {
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }

  return server.createHandler({
    path: '/api/graphql',
  })(req, res);
});
