import { ApolloServer } from 'apollo-server-micro';
import Cors from 'micro-cors';
import { typeDefs } from './schemas';
import { resolvers } from './resolvers';

const cors = Cors({ allowMethods: ['GET', 'POST'] });

const apolloServer = new ApolloServer({ typeDefs, resolvers });

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = apolloServer.createHandler({ path: '/api/graphql' });

export default cors(handler);
