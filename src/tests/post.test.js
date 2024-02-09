const sinon = require("sinon");
const PostModel = require("../models/post.model");
const PostController = require("../controllers/post.controller");

describe("Post controller", () => {
  // Setup the responses
  let req = {
    body: {
      author: "stswenguser",
      title: "My first test post",
      content: "Random content",
    },
  };

  let error = new Error({ error: "Some error message" });

  let res = {};

  let expectedResult;

  describe("create", () => {
    var createPostStub;

    beforeEach(() => {
      // before every test case setup first
      res = {
        json: sinon.spy(),
        status: sinon.stub().returns({ end: sinon.spy() }),
      };
    });

    afterEach(() => {
      // executed after the test case
      createPostStub.restore();
    });

    it("should return the created post object", () => {
      // Arrange
      expectedResult = {
        _id: "507asdghajsdhjgasd",
        title: "My first test post",
        content: "Random content",
        author: "stswenguser",
        date: Date.now(),
      };

      createPostStub = sinon
        .stub(PostModel, "createPost")
        .yields(null, expectedResult);

      // Act
      PostController.create(req, res);

      // Assert
      sinon.assert.calledWith(PostModel.createPost, req.body);
      sinon.assert.calledWith(res.json, sinon.match({ title: req.body.title }));
      sinon.assert.calledWith(
        res.json,
        sinon.match({ content: req.body.content })
      );
      sinon.assert.calledWith(
        res.json,
        sinon.match({ author: req.body.author })
      );
    });

    // Error Scenario
    it("should return status 500 on server error", () => {
      // Arrange
      createPostStub = sinon.stub(PostModel, "createPost").yields(error);

      // Act
      PostController.create(req, res);

      // Assert
      sinon.assert.calledWith(PostModel.createPost, req.body);
      sinon.assert.calledWith(res.status, 500);
      sinon.assert.calledOnce(res.status(500).end);
    });
  });

  /*************************************************************************** */
  describe("update", () => {
    var updatePostStub;

    beforeEach(() => {
      // before every test case setup first
      res = {
        json: sinon.spy(),
        status: sinon.stub().returns({ end: sinon.spy() }),
      };

      // stub updatePost
      updatePostStub = sinon.stub(PostModel, "updatePost");
    });

    afterEach(() => {
      // executed after the test case
      updatePostStub.restore();
    });

    // Scenario
    it("should return the updated post object", () => {
      //Arrange
      const postId = "507asdghajsdhjgasd";
      const updateData = {
        title: "Updated Title",
        content: "Updated Content",
        author: "Updated Author",
        date: Date.now(),
      };

      const updatedPost = {
        _id: postId,
        title: updateData.title,
        content: updateData.content,
        author: updateData.author,
        date: updateData.date,
      };

      updatePostStub.withArgs(postId, updateData).yields(null, updatedPost);

      req = {
        params: {
          id: postId,
        },
        body: updateData,
      };

      // Act
      PostController.update(req, res);

      //Assert
      sinon.assert.calledWith(PostModel.updatePost, postId, updateData);
      sinon.assert.calledWith(res.json, sinon.match(updatedPost));
    });

    it("should return status 500 on server error", () => {
      //Arrange
      const postId = "507asdghajsdhjgasd";
      const updateData = {
        title: "Updated Title",
        content: "Updated Content",
        author: "Updated Author",
        date: Date.now(),
      };

      updatePostStub.withArgs(postId, updateData).yields(new Error("Server Error"));

      req = {
        params: {
          id: postId,
        },
        body: updateData,
      };

      // Act
      PostController.update(req, res);

      //Assert
      sinon.assert.calledWith(PostModel.updatePost, postId, updateData);
      sinon.assert.calledWith(res.status, 500);
      sinon.assert.calledOnce(res.status(500).end);
    });
  });

  /*************************************************************************** */
  describe("find", () => {
    var findPostStub;

    beforeEach(() => {
      // before every test case setup first
      res = {
        json: sinon.spy(),
        status: sinon.stub().returns({ end: sinon.spy() }),
      };

      // stub findPost
      findPostStub = sinon.stub(PostModel, "findPost");
    });

    afterEach(() => {
      // executed after the test case
      findPostStub.restore();
    });

    // Scenario
    it("should return the found post object", () => {
      // Arrange
      const postId = "507asdghajsdhjgasd";
      const postToFind = {
        _id: postId,
        title: "My first test post",
        content: "Random content",
      };

      findPostStub.withArgs(postId).yields(null, postToFind);

      req = {
        params: {
          id: postId,
        },
      };

      // Act
      PostController.findPost(req, res);

      // Assert
      sinon.assert.calledWith(PostModel.findPost, postId);
      sinon.assert.calledWith(res.json, sinon.match(postToFind));
    });

    // Error scenario
    it("should return status 500 on server error", () => {
      // Arrange
      const postId = "507asdghajsdhjgasd";

      findPostStub.withArgs(postId).yields(new Error("Some error occured!"));

      req = {
        params: {
          id: postId,
        },
      };

      // Act
      PostController.findPost(req, res);

      // Assert
      sinon.assert.calledWith(PostModel.findPost, postId);
      sinon.assert.calledWith(res.status, 500);
      sinon.assert.calledOnce(res.status(500).end);
    });
  });
});
