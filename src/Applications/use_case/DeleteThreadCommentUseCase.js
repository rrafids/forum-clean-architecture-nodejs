class DeleteThreadCommentUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(threadId, commentId, owner) {
    await this._threadRepository.verifyThreadCommentOwner(commentId, owner);

    return this._threadRepository.deleteThreadComment(threadId, commentId);
  }
}

module.exports = DeleteThreadCommentUseCase;
