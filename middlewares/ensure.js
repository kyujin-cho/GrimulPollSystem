function ensureAuthenticated(ctx, next) {
  if (ctx.isAuthenticated()) { 
    return next()
  }
  ctx.redirect('/admin/login')
}

module.exports = ensureAuthenticated