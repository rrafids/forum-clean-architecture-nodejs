class GetThreadByIdUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);

    if (thread) {
      const comments = await this._threadRepository.getThreadCommentsByThreadId(threadId);

      if (comments.length) {
        comments.map((item) => {
          if (item.is_deleted) {
            item.content = '**komentar telah dihapus**';
          }

          delete item.is_deleted;

          return item;
        });

        thread.comments = comments;
      }
    }

    return thread;
  }
}

module.exports = GetThreadByIdUseCase;
