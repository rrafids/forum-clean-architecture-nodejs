class VerifyThreadCommentOwnerUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(commentId, owner) {
    return this._threadRepository.verifyThreadCommentOwner(commentId, owner);
  }
}

module.exports = VerifyThreadCommentOwnerUseCase;
