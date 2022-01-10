const jwt = require('jsonwebtoken')
const { SECRET } = require('../utils/config')
const { User, Session } = require('../models')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization') //returns the specified http request header
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch {
      res.status(401).json({ error: 'token invalid' })
    }
  } else {
    res.status(401).json({ error: 'token missing' })
  }
  next()
}

const userChecker = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (!user.enabled) {
    return res.status(401).json({ error: 'you have lost your access, please consult the admin' })
  }
  const session = await Session.findOne({
    where: {userId: user.id}
  })
  if (!session) {
    return res.status(401).json({ error: 'the used token is no longer valid' })
  }
  req.user = user
  next()
}

module.exports = {
  tokenExtractor,
  userChecker
}