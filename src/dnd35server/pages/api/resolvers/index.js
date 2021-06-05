import axios from 'axios';
import { Client } from 'pg';
import keys from '../../../../config/keys.js';

const client = new Client({
  user: keys.PG_CONNECTION.USER,
  host: keys.PG_CONNECTION.HOST,
  database: keys.PG_CONNECTION.DATABASE,
  password: keys.PG_CONNECTION.PASSWORD,
  port: keys.PG_CONNECTION.PORT,
});

export const resolvers = {
  Query: {
    getMonsters: async () => {
      try {
        await client.connect();
        const res = await client.query('SELECT * from dnd35graph.monster;');
        return res.rows;
      } catch (error) {
        throw error;
      } finally {
        await client.end();
      }
    },
    getMonster: async (_, args) => {
      try {
        await client.connect();
        const monsterName = args.name;
        const values = [monsterName];
        const res = await client.query(
          'SELECT * from dnd35graph.monster WHERE name=$1;',
          values
        );
        return res.rows[0];
      } catch (error) {
        throw error;
      } finally {
        await client.end();
      }
    },
  },
};
