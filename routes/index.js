import Router from 'koa-router'
import api from './api'

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

router.use(api.routes(), api.allowedMethods())
export default router