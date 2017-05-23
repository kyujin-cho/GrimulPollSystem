import Router from 'koa-router'
import api from './api'
import ensure from '../middlewares/ensure'
import passport from 'koa-passport'

const router = new Router()
router.get('/', async function (ctx, next) {
  ctx.state = {
    title: 'koa2 title'
  }
  await ctx.render('index', {})
})

router.get('/addUser', async function (ctx, next) {
  await ctx.render('addUser', {})
})

router.get('/admin', ensure, async function (ctx, next) {
  await ctx.render('admin', {})
})

router.get('/admin/login', async function (ctx, next) {
  await ctx.render('login', {})
})

router.post('/admin/login', 
  passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/admin/login'
  }),
  async function (ctx, next) {
    ctx.flash('username')
    if(ctx.request.body.username.length === 0 ||
    ctx.request.body.password.length === 0) {
      ctx.flash = {username: ctx.request.body.username, loginError: 'Please specify both username and password!' }
      ctx.redirect('/admin/login')
    } else next()
  })

router.get('/admin/logout', ensure, async function (ctx, next) {
  ctx.logout()
  await ctx.redirect('/admin/login')
})
router.use(api.routes(), api.allowedMethods())
export default router