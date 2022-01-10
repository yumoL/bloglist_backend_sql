const jwt = require('jsonwebtoken')
const router = require('express').Router()
const bcrypt = require('bcryptjs')

const { SECRET } = require('../utils/config')
const { User, Session } = require('../models')

router.post('/', async (req, res, next) => {
  const body = req.body

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  if (!user.enabled) {
    return res.status(401).json({
      error: 'You have lost your access, please consult the admin'
    })
  }

  const passwordCorrect = !user ? false : await bcrypt.compare(body.password, user.password)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password'
    })
  }

  const session = await Session.findOne({
    where: { userId: user.id }
  })

  let token
  if (session) {
    //just reuse the existing token
    token = session.token
  } else {
    const userForToken = {
      username: user.username,
      id: user.id,
    }
    token = jwt.sign(userForToken, SECRET)
    try {
      await Session.create({
        userId: user.id,
        token: token
      })
    } catch (err) {
      next(err)
    }
  }
  res
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = router