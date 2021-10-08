const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const userRequestPayload = {
        username: 'asdqweqwe',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };
      const authenticationRequestPayload = {
        username: 'asdqweqwe',
        password: 'secret',
      };
      const threadRequestPayload = {
        title: 'dicoding',
        body: 'secret',
      };

      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userRequestPayload,
      });

      const authenticationResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: authenticationRequestPayload,
      });

      const authenticationResponseJson = JSON.parse(authenticationResponse.payload);

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadRequestPayload,
        headers: {
          Authorization: `Bearer ${authenticationResponseJson.data.accessToken}`,
        },
      });

      // Assert
      const threadResponseJson = JSON.parse(threadResponse.payload);
      expect(threadResponse.statusCode).toEqual(201);
      expect(threadResponseJson.status).toEqual('success');
      expect(threadResponseJson.data.addedThread).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const userRequestPayload = {
        username: 'asdqweqwe',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };
      const authenticationRequestPayload = {
        username: 'asdqweqwe',
        password: 'secret',
      };
      const threadRequestPayload = {
        title: 'dicoding',
      };

      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userRequestPayload,
      });

      const authenticationResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: authenticationRequestPayload,
      });

      const authenticationResponseJson = JSON.parse(authenticationResponse.payload);

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadRequestPayload,
        headers: {
          Authorization: `Bearer ${authenticationResponseJson.data.accessToken}`,
        },
      });

      // Assert
      const threadResponseJson = JSON.parse(threadResponse.payload);
      expect(threadResponse.statusCode).toEqual(400);
      expect(threadResponseJson.message).toEqual(
        'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada',
      );
      expect(threadResponseJson.status).toEqual('fail');
    });
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const userRequestPayload = {
        username: 'asdqweqwe',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };
      const authenticationRequestPayload = {
        username: 'asdqweqwe',
        password: 'secret',
      };
      const threadRequestPayload = {
        title: 'dicoding',
        body: 'secret',
      };
      const threadCommentRequestPayload = {
        content: 'thread comment',
      };

      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userRequestPayload,
      });

      const authenticationResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: authenticationRequestPayload,
      });

      const authenticationResponseJson = JSON.parse(authenticationResponse.payload);

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadRequestPayload,
        headers: {
          Authorization: `Bearer ${authenticationResponseJson.data.accessToken}`,
        },
      });

      const threadResponseJson = JSON.parse(threadResponse.payload);

      const threadCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadResponseJson.data.addedThread.id}/comments`,
        payload: threadCommentRequestPayload,
        headers: {
          Authorization: `Bearer ${authenticationResponseJson.data.accessToken}`,
        },
      });

      // Assert
      const threadCommentResponseJson = JSON.parse(threadCommentResponse.payload);

      expect(threadCommentResponse.statusCode).toEqual(201);
      expect(threadCommentResponseJson.status).toEqual('success');
      expect(threadCommentResponseJson.data.addedComment).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const userRequestPayload = {
        username: 'asdqweqwe',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };
      const authenticationRequestPayload = {
        username: 'asdqweqwe',
        password: 'secret',
      };
      const threadRequestPayload = {
        title: 'dicoding',
        body: 'secret',
      };
      const threadCommentRequestPayload = {};

      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userRequestPayload,
      });

      const authenticationResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: authenticationRequestPayload,
      });

      const authenticationResponseJson = JSON.parse(authenticationResponse.payload);

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadRequestPayload,
        headers: {
          Authorization: `Bearer ${authenticationResponseJson.data.accessToken}`,
        },
      });

      const threadResponseJson = JSON.parse(threadResponse.payload);

      const threadCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadResponseJson.data.addedThread.id}/comments`,
        payload: threadCommentRequestPayload,
        headers: {
          Authorization: `Bearer ${authenticationResponseJson.data.accessToken}`,
        },
      });

      // Assert
      const threadCommentResponseJson = JSON.parse(threadCommentResponse.payload);
      expect(threadCommentResponse.statusCode).toEqual(400);
      expect(threadCommentResponseJson.message).toEqual(
        'tidak dapat membuat thread comment baru karena properti yang dibutuhkan tidak ada',
      );
      expect(threadCommentResponseJson.status).toEqual('fail');
    });

    it('should response 404 when thread with requested id doesnt exist', async () => {
      // Arrange
      const userRequestPayload = {
        username: 'asdqweqwe',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };
      const authenticationRequestPayload = {
        username: 'asdqweqwe',
        password: 'secret',
      };
      const threadRequestPayload = {
        title: 'dicoding',
        body: 'secret',
      };
      const threadCommentRequestPayload = {
        content: 'thread comment',
      };

      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userRequestPayload,
      });

      const authenticationResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: authenticationRequestPayload,
      });

      const authenticationResponseJson = JSON.parse(authenticationResponse.payload);

      await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadRequestPayload,
        headers: {
          Authorization: `Bearer ${authenticationResponseJson.data.accessToken}`,
        },
      });

      const threadCommentResponse = await server.inject({
        method: 'POST',
        url: '/threads/xxx/comments',
        payload: threadCommentRequestPayload,
        headers: {
          Authorization: `Bearer ${authenticationResponseJson.data.accessToken}`,
        },
      });

      // Assert
      const threadCommentResponseJson = JSON.parse(threadCommentResponse.payload);
      expect(threadCommentResponse.statusCode).toEqual(404);
      expect(threadCommentResponseJson.message).toEqual(
        'comment gagal ditambahkan ke thread, thread tidak ditemukan.',
      );
      expect(threadCommentResponseJson.status).toEqual('fail');
    });
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const userRequestPayload = {
        username: 'asdqweqwe',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };
      const authenticationRequestPayload = {
        username: 'asdqweqwe',
        password: 'secret',
      };
      const threadRequestPayload = {
        title: 'dicoding',
        body: 'secret',
      };
      const threadCommentRequestPayload = {
        content: 'thread comment',
      };

      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userRequestPayload,
      });

      const authenticationResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: authenticationRequestPayload,
      });

      const authenticationResponseJson = JSON.parse(authenticationResponse.payload);

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadRequestPayload,
        headers: {
          Authorization: `Bearer ${authenticationResponseJson.data.accessToken}`,
        },
      });

      const threadResponseJson = JSON.parse(threadResponse.payload);

      const threadCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadResponseJson.data.addedThread.id}/comments`,
        payload: threadCommentRequestPayload,
        headers: {
          Authorization: `Bearer ${authenticationResponseJson.data.accessToken}`,
        },
      });

      // Assert
      const threadCommentResponseJson = JSON.parse(threadCommentResponse.payload);

      expect(threadCommentResponse.statusCode).toEqual(201);
      expect(threadCommentResponseJson.status).toEqual('success');
      expect(threadCommentResponseJson.data.addedComment).toBeDefined();
    });

    describe('when delete /threads/{threadId}/comments/{commentId}', () => {
      it('should response 200 when request deleted succesfully', async () => {
        // Arrange
        const userRequestPayload = {
          username: 'asdqweqwesdsd',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        };
        const authenticationRequestPayload = {
          username: 'asdqweqwesdsd',
          password: 'secret',
        };
        const threadRequestPayload = {
          title: 'dicoding',
          body: 'secret',
        };
        const threadCommentRequestPayload = {
          content: 'dicoding',
        };

        // eslint-disable-next-line no-undef
        const server = await createServer(container);

        // Action
        await server.inject({
          method: 'POST',
          url: '/users',
          payload: userRequestPayload,
        });

        const authenticationResponse = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: authenticationRequestPayload,
        });

        const authenticationResponseJson = JSON.parse(authenticationResponse.payload);

        const threadResponse = await server.inject({
          method: 'POST',
          url: '/threads',
          payload: threadRequestPayload,
          headers: {
            Authorization: `Bearer ${authenticationResponseJson.data.accessToken}`,
          },
        });

        const threadResponseJson = JSON.parse(threadResponse.payload);

        const threadCommentResponse = await server.inject({
          method: 'POST',
          url: `/threads/${threadResponseJson.data.addedThread.id}/comments`,
          payload: threadCommentRequestPayload,
          headers: {
            Authorization: `Bearer ${authenticationResponseJson.data.accessToken}`,
          },
        });

        const threadCommentResponseJson = JSON.parse(threadCommentResponse.payload);

        const deleteThreadCommentResponse = await server.inject({
          method: 'DELETE',
          url: `/threads/${threadResponseJson.data.addedThread.id}/comments/${threadCommentResponseJson.data.addedComment.id}`,
          headers: {
            Authorization: `Bearer ${authenticationResponseJson.data.accessToken}`,
          },
        });

        expect(deleteThreadCommentResponse.statusCode).toEqual(200);
      });
    });

    describe('when get /threads/{threadId}', () => {
      it('should response 200', async () => {
        // Arrange
        const userRequestPayload = {
          username: 'bowodasbord',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        };
        const authenticationRequestPayload = {
          username: 'bowodasbord',
          password: 'secret',
        };
        const threadRequestPayload = {
          title: 'dicoding',
          body: 'secret',
        };
        const threadCommentRequestPayload = {
          content: 'dicoding',
        };

        // eslint-disable-next-line no-undef
        const server = await createServer(container);

        // Action
        await server.inject({
          method: 'POST',
          url: '/users',
          payload: userRequestPayload,
        });

        const authenticationResponse = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: authenticationRequestPayload,
        });

        const authenticationResponseJson = JSON.parse(authenticationResponse.payload);

        const threadResponse = await server.inject({
          method: 'POST',
          url: '/threads',
          payload: threadRequestPayload,
          headers: {
            Authorization: `Bearer ${authenticationResponseJson.data.accessToken}`,
          },
        });

        const threadResponseJson = JSON.parse(threadResponse.payload);

        await server.inject({
          method: 'POST',
          url: `/threads/${threadResponseJson.data.addedThread.id}/comments`,
          payload: threadCommentRequestPayload,
          headers: {
            Authorization: `Bearer ${authenticationResponseJson.data.accessToken}`,
          },
        });

        const getThreadByIdResponse = await server.inject({
          method: 'GET',
          url: `/threads/${threadResponseJson.data.addedThread.id}`,
        });

        expect(getThreadByIdResponse.statusCode).toEqual(200);
      });
    });
  });
});
