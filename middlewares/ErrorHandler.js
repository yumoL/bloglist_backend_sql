const { ValidationError, Error } = require('sequelize')

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  console.error(error)
  if (error instanceof ValidationError || error instanceof Error) {
    return res.status(400).send({ error: error.message })
  }
  next(error)
}

module.exports = {
  unknownEndpoint,
  errorHandler
}
