const AddThreadComment = require('../AddThreadComment');

describe('CreateThreadComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const threadId = 'thread-123';
    const payload = {};

    // Action & Assert
    expect(() => new AddThreadComment(payload)).toThrowError('ADD_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const threadId = 'thread-123';
    const payload = {
      content: 213312,
    };

    // Action & Assert
    expect(() => new AddThreadComment(payload)).toThrowError('ADD_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddThreadComment entities correctly', () => {
    // Arrange
    const threadId = 'thread-123';
    const payload = {
      content: 'thread comment',
    };

    // Action
    const addThreadComment = new AddThreadComment(payload);

    // Assert
    expect(addThreadComment).toBeInstanceOf(AddThreadComment);
    expect(addThreadComment.content).toEqual(payload.content);
  });
});
