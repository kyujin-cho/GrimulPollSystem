function ensureAuthenticated(ctx, next) {
  if (ctx.isAuthenticated() && ctx.state.user.privilege.indexOf('administrator') !== -1) { 
    return next()
  }
  ctx.redirect('/login')
}

module.exports = ensureAuthenticated