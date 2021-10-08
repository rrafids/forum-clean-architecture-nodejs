const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThreadComment = require('../../Domains/threads/entities/AddedThreadComment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(addThread, owner) {
    const { title, body } = addThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, user_id AS owner',
      values: [id, title, body, owner],
    };
    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async getThreadById(threadId) {
    const query = {
      text: `SELECT threads.id, threads.title, threads.body, threads.created_at AS date, users.username FROM threads
        JOIN users ON users.id = threads.user_id
        WHERE threads.id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0]) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return result.rows[0];
  }

  async getThreadCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT thread_comments.id, users.username, thread_comments.created_at AS date, 
      thread_comments.is_deleted, thread_comments.content FROM thread_comments
      JOIN users ON users.id = thread_comments.user_id
      WHERE thread_id = $1`,
      values: [threadId],
    };

    const resultThreadComments = await this._pool.query(query);

    return resultThreadComments.rows;
  }

  async addThreadComment(threadId, addThreadComment, owner) {
    const { content } = addThreadComment;
    const commentId = `threadcomment-${this._idGenerator()}`;

    const queryThread = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId],
    };

    const threadResult = await this._pool.query(queryThread);

    if (!threadResult.rows[0]) {
      throw new NotFoundError('comment gagal ditambahkan ke thread, thread tidak ditemukan.');
    }

    const query = {
      text: 'INSERT INTO thread_comments VALUES($1, $2, $3, $4) RETURNING id, content, user_id AS owner',
      values: [commentId, content, threadId, owner],
    };

    const result = await this._pool.query(query);

    return new AddedThreadComment({ ...result.rows[0] });
  }

  async deleteThreadComment(threadId, commentId) {
    const queryThreadComment = {
      text: 'UPDATE thread_comments SET is_deleted = $1 WHERE thread_id = $2 AND id = $3',
      values: [true, threadId, commentId],
    };

    const threadCommentResult = await this._pool.query(queryThreadComment);

    if (!threadCommentResult.rowCount) {
      throw new NotFoundError('comment gagal dihapus, comment tidak ditemukan.');
    }
  }

  async verifyThreadCommentOwner(commentId, owner) {
    const query = {
      text: 'SELECT user_id AS owner FROM thread_comments WHERE id = $1',
      values: [commentId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Comment tidak ditemukan');
    }
    const comment = result.rows[0];
    if (comment.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }
}

module.exports = ThreadRepositoryPostgres;
