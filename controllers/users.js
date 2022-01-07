const router = require('express').Router()
const bcrypt = require('bcryptjs')

const { User, Blog } = require('../models')

const userFinder = async (req, res, next) => {
  const { username } = req.params
  req.user = await User.findOne({
    where: { username }
  })
  next()
}

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

router.post('/', async (req, res, next) => {
  //{name, username, password} = req.body
  try {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(req.body.password, saltRounds)
    const user = await User.create({ ...req.body, password: passwordHash })
    res.json(user)
  } catch (error) {
    next(error)
  }
})

router.put('/:username', userFinder, async (req, res, next) => {
  if (req.user) {
    try {
      req.user.username = req.body.username
      await req.user.save()
      res.json(req.user)
    } catch (error) {
      next(error)
    }
  } else {
    res.sendStatus(404)
  }
})


module.exports = router