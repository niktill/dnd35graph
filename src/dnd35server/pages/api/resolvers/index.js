import pool from '../../../db/db_connection.js';

export const resolvers = {
  Query: {
    getMonsters: async () => {
      const client = await pool.connect();
      try {
        const res = await client.query('SELECT * from dnd35graph.monster;');
        return res.rows;
      } catch (error) {
        throw error;
      } finally {
        client.release();
      }
    },
    getMonster: async (_, args) => {
      const client = await pool.connect();
      try {
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
        client.release();
      }
    },
  },
};
