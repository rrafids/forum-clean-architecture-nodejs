const AddThreadComment = require('../../Domains/threads/entities/AddThreadComment');

class AddThreadCommentUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(threadId, useCasePayload, owner) {
    const addThreadComment = new AddThreadComment(
      useCasePayload,
    );
    return this._threadRepository.addThreadComment(
      threadId,
      addThreadComment,
      owner,
    );
  }
}

module.exports = AddThreadCommentUseCase;
