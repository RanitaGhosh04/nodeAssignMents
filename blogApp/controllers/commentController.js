const Comment = require('../models/Comment');

exports.createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const comment = new Comment({
      content,
      author: req.userId,
      post: req.params.postId,
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findOneAndUpdate(
      { _id: req.params.id, author: req.userId },
      { content },
      { new: true }
    );
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found or unauthorized' });
    }
    res.json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findOneAndDelete({ _id: req.params.id, author: req.userId });
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found or unauthorized' });
    }
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};