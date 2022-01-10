const router = require('express').Router()
const { tokenExtractor, userChecker } = require('../middlewares/userHandler')
const { Session } = require('../models')

router.post('/', tokenExtractor, userChecker, async (req, res, next) => {
  try {
    await Session.destroy({
      where: { userId: req.user.id }
    })
  } catch (err) {
    next(err)
  }
  return res.status(202).send('Successfully logged out')
})

module.exports = router