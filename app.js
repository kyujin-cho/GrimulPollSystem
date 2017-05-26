const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const co = require('co')
const convert = require('koa-convert')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')()
const logger = require('koa-logger')
const mongoose = require('mongoose')

const index = require('./routes/index')

import passport from 'koa-passport'
import {Strategy as LocalStrategy} from 'passport-local'
import session from 'koa-generic-session'
import configuration from './configuration'

app.keys = ['2ervyn13W@U@UYRIOFfnjfnjecnl4wf4']
// middlewares
app.use(bodyparser)
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))
app.use(convert(session()))
app.use(passport.initialize())
app.use(passport.session())

// middlewares
app.use(convert(bodyparser))
app.use(convert(json()))
app.use(convert(logger()))
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// router.use('/', index.routes(), index.allowedMethods())

app.use(index.routes(), index.allowedMethods())
// response

app.on('error', function(err, ctx){
  console.log(err)
})

const db = mongoose.connection
db.on('error', console.error)
db.once('open', () => {
  console.log('connected to mongodb server')
})
mongoose.connect('localhost')


passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

passport.use('local', new LocalStrategy((username, password, done) => {
  console.log(password)

  if(username === configuration.adminUsername && password === configuration.adminPassword)
    return done(null, {})
  else
    return done(null, false)
}))

module.exports = app