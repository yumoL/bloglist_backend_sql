const router = require('express').Router()

const tokenExtractor = require('../middlewares/tokenExtractor')
const blogFinder = require('../middlewares/blogFinder')
const { Reading, User, Blog } = require('../models')

router.post('/', tokenExtractor, async (req, res, next) => {
  //const { userId, blogId, read } = req.body
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.findByPk(req.body.blogId)

    if (!blog) {
      res.status(401).json({ error: 'no such blog ' })
      return
    }
    if (user.id != Number(req.body.userId)) {
      res.status(401).json({ error: 'you can only mark blogs for yourself' })
      return
    }
    const newReading = await Reading.create({
      userId: user.id,
      blogId: req.body.blogId,
      read: req.body.read ? read : false
    })
    res.json(newReading)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', tokenExtractor, async (req, res, next) => {
  let reading = await Reading.findByPk(req.params.id)

  if (!reading) {
    res.status(401).json({ error: 'no such reading' })
    return
  }

  const user = await User.findByPk(req.decodedToken.id)

  if (reading.userId != user.id) {
    res.status(401).json({ error: 'you can only modify your own readings' })
    return
  }

  try {
    reading.read = req.body.read
    await reading.save()
    res.json(reading)
  } catch (err) {
    next(err)
  }
})

module.exports = router