const Blog = require('./blog')
const User = require('./user')
const Reading = require('./reading')
const Session = require('./session')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: Reading, as: 'marked_blogs' })
Blog.belongsToMany(User, { through: Reading, as: 'user_marked' })

// User.sync({ alter: true })
// Blog.sync({ alter: true })

module.exports = {
  Blog,
  User,
  Reading,
  Session
}