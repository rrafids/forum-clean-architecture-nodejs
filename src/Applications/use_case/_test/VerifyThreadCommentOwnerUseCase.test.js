const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const VerifyThreadCommentOwnerUseCase = require('../VerifyThreadCommentOwnerUseCase');

describe('VerifyThreadCommentOwnerUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the verify thread comment action correctly', async () => {
    // Arrange
    const owner = 'user-123';
    const commentId = 'threadcomment-123';

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadCommentOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const verifyThreadCommentOwnerUseCase = new VerifyThreadCommentOwnerUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const verifyThreadCommentOwner = await verifyThreadCommentOwnerUseCase.execute(
      commentId,
      owner,
    );

    // Assert
    expect(verifyThreadCommentOwner).toStrictEqual();
  });
});
