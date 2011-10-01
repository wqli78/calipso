var crypto = require('crypto');

module.exports = exports = function secretPasswordPlugin (schema, options) {
  schema.add({ password_md5b: String })

  schema.pre('save', function (next) {
    this.password_md5b = crypto.createHash('md5').update(this.password).digest("hex");
    next()
  })

  if (options && options.index) {
    schema.path('password_md5b').index(options.index)
  }
}