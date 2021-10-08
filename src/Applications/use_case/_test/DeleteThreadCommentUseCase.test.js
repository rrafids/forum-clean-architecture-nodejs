const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteThreadCommentUseCase = require('../DeleteThreadCommentUseCase');

describe('DeleteThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the delete thread comment action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'threadcomment-123';
    const owner = 'user-123';

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.deleteThreadComment = jest.fn()
      .mockImplementation(() => Promise.resolve({
        status: 'success',
      }));

    mockThreadRepository.verifyThreadCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const getThreadCommentUseCase = new DeleteThreadCommentUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const deletedThreadComment = await getThreadCommentUseCase.execute(threadId, commentId, owner);

    // Assert
    expect(deletedThreadComment).toStrictEqual({
      status: 'success',
    });
  });
});
