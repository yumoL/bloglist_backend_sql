const router = require('express').Router()
const { Op } = require('sequelize')

const { Blog, User } = require('../models')
const { tokenExtractor, userChecker } = require('../middlewares/userHandler')
const blogFinder = require('../middlewares/blogHandler')

router.get('/', async (req, res) => {
  let pattern = '%%'

  if (req.query.search) {
    pattern = `%${req.query.search}%`
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['username']
    },
    where: {
      [Op.or]: [{ title: { [Op.iLike]: pattern } },
      {
        author: { [Op.iLike]: pattern }
      }]
    },
    order: [['likes', 'DESC']]
  })
  res.json(blogs)
})

router.post('/', tokenExtractor, userChecker, async (req, res, next) => {
  //const { author, url, title, year } = req.body
  try {
    //const user = await User.findByPk(req.decodedToken.id)
    const newBlog = await Blog.create({
      ...req.body,
      userId: req.user.id,
      year: Number(req.body.year)
    })
    res.json(newBlog)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', blogFinder, tokenExtractor, userChecker, async (req, res) => {
  if (req.blog.userId != req.decodedToken.id) {
    res.json({ error: 'You can not delete a blog that does not belong to you' })
    return
  }
  if (req.blog) {
    await req.blog.destroy()
  }
  res.status(204).end()
})

router.put('/:id', blogFinder, tokenExtractor, userChecker, async (req, res, next) => {
  if (req.blog.userId != req.decodedToken.id) {
    res.json({ error: 'You can not modify a blog that does not belong to you' })
    return
  }
  if (req.blog) {
    try {
      req.blog.likes = Number(req.body.likes)
      await req.blog.save()
      res.json(req.blog)
    } catch (error) {
      next(error)
    }

  } else {
    res.status(404).end()
  }
})

module.exports = router