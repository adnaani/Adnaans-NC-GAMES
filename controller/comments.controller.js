const { removeCommentsById } = require("../model/comments.model");

exports.deleteCommentsById = (req, res, next) => {
  const { comment_id } = req.params;

  removeCommentsById(comment_id)
    .then((comment) => {
      res.status(204).send({ comment });
    })
    .catch(next);
};
