const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddThreadComment = require('../../../Domains/threads/entities/AddThreadComment');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');

describe('ThreadRepository postgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'dicoding1',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });

      const expectedAddedThread = {
        body: 'thread body',
        created_at: '2021-09-30T05:37:07.165Z',
        id: 'thread-122',
        title: 'thread title',
        owner: 'user-122',
      };
      const fakeIdGenerator = () => '122'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await userRepositoryPostgres.addUser(registerUser);

      // Arrange
      const addThread = new AddThread({
        title: 'thread title',
        body: 'thread body',
      });
      const fakeOwner = 'user-122';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(addThread, fakeOwner);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-122');
      expect(threads[0].id).toEqual(expectedAddedThread.id);
    });
  });

  describe('addThreadComment function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'dicoding15',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const fakeIdGenerator = () => '123456'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await userRepositoryPostgres.addUser(registerUser);

      // Arrange
      const addThread = new AddThread({
        title: 'thread title',
        body: 'thread body',
      });
      const fakeOwner = 'user-123456';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const threads = await threadRepositoryPostgres.addThread(addThread, fakeOwner);

      // Arrange
      const addThreadComment = new AddThreadComment({
        content: 'thread comment',
      });

      // Action
      await threadRepositoryPostgres.addThreadComment(threads.id, addThreadComment, fakeOwner);

      // Assert
      const threadComments = await ThreadsTableTestHelper.findThreadCommentsByThreadId(
        'thread-123456',
      );
      expect(threadComments).toHaveLength(1);
    });
  });

  describe('deleteThreadComment function', () => {
    it('should persist delete thread comment', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'dicoding156',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const fakeIdGenerator = () => '1234567'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await userRepositoryPostgres.addUser(registerUser);

      // Arrange
      const addThread = new AddThread({
        title: 'thread title',
        body: 'thread body',
      });
      const fakeOwner = 'user-1234567';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const threads = await threadRepositoryPostgres.addThread(addThread, fakeOwner);

      // Arrange
      const addThreadComment = new AddThreadComment({
        content: 'thread comment',
      });

      // Action
      const threadComment = await threadRepositoryPostgres.addThreadComment(
        threads.id,
        addThreadComment,
        fakeOwner,
      );

      const deletedThreadComment = await threadRepositoryPostgres.deleteThreadComment(
        threads.id,
        threadComment.id,
      );
      expect(deletedThreadComment).toEqual();
    });
  });

  describe('getThreadById function', () => {
    it('should persist get thread and return thread and its comments correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'dicoding1567sd',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const fakeIdGenerator = () => '12345678'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await userRepositoryPostgres.addUser(registerUser);

      // Arrange
      const addThread = new AddThread({
        title: 'thread title',
        body: 'thread body',
      });
      const expectedThread = {
        body: 'thread body',
        date: '2021-09-30T05:37:07.165Z',
        id: 'thread-12345678',
        title: 'thread title',
        username: 'dicoding1567sd',
      };
      const fakeOwner = 'user-12345678';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const threads = await threadRepositoryPostgres.addThread(addThread, fakeOwner);

      // Arrange
      const addThreadComment = new AddThreadComment({
        content: 'thread comment',
      });

      // Action
      await threadRepositoryPostgres.addThreadComment(threads.id, addThreadComment, fakeOwner);

      const getThread = await threadRepositoryPostgres.getThreadById(threads.id);
      expect(getThread.id).toEqual(expectedThread.id);
    });
  });

  describe('getThreadCommentsByThreadId function', () => {
    it('should persist get thread comments by thread id and return comments correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'dicoding1567sd',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const fakeIdGenerator = () => '12345678'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await userRepositoryPostgres.addUser(registerUser);

      // Arrange
      const addThread = new AddThread({
        title: 'thread title',
        body: 'thread body',
      });
      const expectedThreadComments = {
        content: 'thread comment',
        date: '2021-09-30T05:37:07.170Z',
        id: 'threadcomment-12345678',
        is_deleted: false,
        username: 'dicoding1567sd',
      };
      const fakeOwner = 'user-12345678';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const threads = await threadRepositoryPostgres.addThread(addThread, fakeOwner);

      // Arrange
      const addThreadComment = new AddThreadComment({
        content: 'thread comment',
      });

      // Action
      const threadComment = await threadRepositoryPostgres.addThreadComment(
        threads.id,
        addThreadComment,
        fakeOwner,
      );

      const getThreadComments = await threadRepositoryPostgres.getThreadCommentsByThreadId(
        threads.id,
      );
      expect(getThreadComments[0].id).toEqual(expectedThreadComments.id);
    });
  });
});
