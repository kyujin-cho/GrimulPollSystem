function ensureAuthenticated(ctx, next) {
  if (ctx.isAuthenticated()) { 
    return next()
  }
  ctx.redirect('/')
}

module.exports = ensureAuthenticated