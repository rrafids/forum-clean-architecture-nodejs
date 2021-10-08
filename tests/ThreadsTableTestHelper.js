/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addThread({ id = 'thread-123', title = 'thread title', body = 'this is thread body' }) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3)',
      values: [id, title, body],
    };

    await pool.query(query);
  },

  async findThreadById(id) {
    const query = {
      text: 'SELECT id, title, body, user_id AS owner, created_at FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async findThreadCommentsByThreadId(threadId) {
    const query = {
      text: 'SELECT * FROM thread_comments WHERE thread_id = $1',
      values: [threadId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM users WHERE 1=1');
    await pool.query('DELETE FROM threads WHERE 1=1');
    await pool.query('DELETE FROM thread_comments WHERE 1=1');
  },
};

module.exports = ThreadsTableTestHelper;
