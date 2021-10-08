const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadCommentUseCase = require('../AddThreadCommentUseCase');
const AddedThreadComment = require('../../../Domains/threads/entities/AddedThreadComment');
const AddThreadComment = require('../../../Domains/threads/entities/AddThreadComment');

describe('AddThreadCommentUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add thread comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'thread comment content',
    };
    const owner = 'user-123';
    const threadId = 'thread-123';
    const expectedAddedThreadComment = new AddedThreadComment({
      id: 'threadcommment-123',
      content: useCasePayload.content,
      owner,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThreadComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedAddedThreadComment));

    /** creating use case instance */
    const getThreadCommentUseCase = new AddThreadCommentUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThreadComment = await getThreadCommentUseCase.execute(
      threadId,
      useCasePayload,
      owner,
    );

    // Assert
    expect(addedThreadComment).toStrictEqual(expectedAddedThreadComment);
  });
});
