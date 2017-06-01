import Router from 'koa-router'
import api from './api'
import ensure from '../middlewares/ensure'
import admin from '../middlewares/admin'
import passport from 'koa-passport'

const router = new Router()
router.get('/', ensure, async function (ctx, next) {
  ctx.state = {
    title: 'koa2 title'
  }
  await ctx.render('index', {})
})

router.get('/addUser', async function (ctx, next) {
  await ctx.render('addUser', {})
})

router.get('/login', async function (ctx, next) {
  await ctx.render('login', {})
})

router.post('/login', 
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }),
  async function (ctx, next) {
    ctx.flash('username')
    if(ctx.request.body.username.length === 0 ||
    ctx.request.body.password.length === 0) {
      ctx.flash = {username: ctx.request.body.username, loginError: 'Please specify both username and password!' }
      ctx.redirect('/login')
    } else next()
  })

router.get('/admin', admin, async function (ctx, next) {
  await ctx.render('admin', {})
})

router.get('/logout', ensure, async function (ctx, next) {
  ctx.logout()
  await ctx.redirect('/login')
})
router.use(api.routes(), api.allowedMethods())
export default router