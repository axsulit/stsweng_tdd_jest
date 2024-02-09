const mongoose = require("./connection");

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
});

const Post = mongoose.model("posts", postSchema);

exports.createPost = (obj, next) => {
  const post = new Post(obj);

  post.save(function (err, post) {
    next(err, post);
  });
};

exports.updatePost = (id, updatedFields, next) => {
  Post.findByIdAndUpdate(id, updatedFields, { new: true }, (err, post) => {
    if (err) {
      return next(err);
    }
    return next(null, post);
  });
};

exports.findPost = (id, next) => {
  Post.findById(id, (err, post) => {
    if (err) {
      return next(err);
    }
    return next(null, post);
  });
};
