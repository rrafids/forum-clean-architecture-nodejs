const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const AddThreadCommentUseCase = require('../../../../Applications/use_case/AddThreadCommentUseCase');
const DeleteThreadCommentUseCase = require('../../../../Applications/use_case/DeleteThreadCommentUseCase');
const VerifyThreadCommentOwnerUseCase = require('../../../../Applications/use_case/VerifyThreadCommentOwnerUseCase');
const GetThreadByIdUseCase = require('../../../../Applications/use_case/GetThreadByIdUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postThreadCommentHandler = this.postThreadCommentHandler.bind(this);
    this.deleteThreadCommentHandler = this.deleteThreadCommentHandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(
      request.payload,
      request.auth.credentials.id,
    );

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadByIdHandler(request, h) {
    const { threadId } = request.params;

    const getThreadByIdUseCase = this._container.getInstance(GetThreadByIdUseCase.name);
    const getThread = await getThreadByIdUseCase.execute(threadId);

    const response = h.response({
      status: 'success',
      data: {
        thread: getThread,
      },
    });
    response.code(200);
    return response;
  }

  async postThreadCommentHandler(request, h) {
    const { threadId } = request.params;
    const addThreadCommentUseCase = this._container.getInstance(AddThreadCommentUseCase.name);
    const addedThreadComment = await addThreadCommentUseCase.execute(
      threadId,
      request.payload,
      request.auth.credentials.id,
    );

    const response = h.response({
      status: 'success',
      data: {
        addedComment: addedThreadComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteThreadCommentHandler(request, h) {
    const { threadId, commentId } = request.params;
    const deleteThreadCommentUseCase = this._container.getInstance(DeleteThreadCommentUseCase.name);
    await deleteThreadCommentUseCase.execute(threadId, commentId, request.auth.credentials.id);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
