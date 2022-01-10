const { Blog } = require('../models')

const blogFinder = async (req, res, next) => {
  const blog = await Blog.findByPk(req.params.id)
  if (!blog) {
    res.status(401).json({ error: 'no such blog' })
    return
  }
  req.blog = blog
  next()
}

module.exports = blogFinder