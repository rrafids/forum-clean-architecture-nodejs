const GetThreadByIdUseCase = require('../GetThreadByIdUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('GetThreadByIdUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the get thread by id action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const comments = [
      {
        id: 'threadcomment-123',
        username: 'dicoding',
        date: '2021-09-30T05:53:24.952Z',
        content: 'sebuah comment',
      },
      {
        id: 'threadcomment-1234',
        username: 'dicoding',
        date: '2021-09-30T05:53:24.952Z',
        content: '**komentar telah dihapus**',
      },
    ];

    const expectedThread = {
      id: 'thread-123',
      title: 'thread title',
      body: 'thread body',
      date: '2021-09-30T05:53:24.945Z',
      username: 'dicoding',
      comments,
    };

    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedThread));

    mockThreadRepository.getThreadCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedThread));

    /** creating use case instance */
    const getThreadByIdUseCase = new GetThreadByIdUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const thread = await getThreadByIdUseCase.execute(threadId);

    // Assert
    expect(thread).toEqual(expectedThread);
  });
});
