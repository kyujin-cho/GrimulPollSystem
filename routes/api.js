import Router from 'koa-router'
import Polls from '../DB/Polls'
import Users from '../DB/Users'
import Response from '../DB/Responses'

const router = new Router({prefix: '/api'})

async function getPolls (ctx, next) {
  try {
    const polls = await Polls.find().exec()
    ctx.body = await {
      success: true,
      data: polls
    }
  } catch (error) {
    ctx.body = await {
      success: false,
      error: error.message
    }
  }
}

async function addPoll(ctx, next) { 
  try {
    const title = ctx.request.body.title
    const contents = ctx.request.body.contents
    if(!title || !contents)
      throw new Error('No title or contents')
    const newPoll = new Polls({
      title: title,
      contents: contents
    })
    const savedPoll = await newPoll.save()
    ctx.body = await {
      success: true, 
      data: savedPoll._id
    }
  } catch(error) {
    ctx.body = await {
      success: false, 
      error: error.message
    }
  }
}

async function getPoll(ctx, next) {
  try {
    const poll = await Polls.findOne({_id: ctx.params.id}).exec()
    const data = {
      _id: poll.id,
      title: poll.title,
      contents: poll.contents
    }
    ctx.body = await {
      success: true,
      data: data
    }
  } catch (error) {
    ctx.body = await {
      success: false,
      error: error.message
    }
  }
}

async function getPollStats(ctx, next) {
  try {
    const poll = await Polls.findOne({_id: ctx.params.id}).exec()
    const data = {
      _id: poll.id,
      title: poll.title,
      contents: poll.contents,
      upCount: poll.up.length,
      downCount: poll.down.length
    }
    ctx.body = await {
      success: true,
      data: data
    }
  } catch (error) {
    ctx.body = await {
      success: false,
      error: error.message
    }
  }
}

async function addVote(ctx, next) { 
  try {
    const user = await Users.findOne({name: ctx.request.body.name, userId: ctx.request.body.userId}).exec()
    if(user === null || user === undefined) 
      throw new Error('No such user')
    let index = -1
    user.attendedPolls.forEach(function(poll, index) {     
      if(poll._id === ctx.params.id)
        return false
      console.log(poll) 
    })
    if(index !== (user.attendedPolls.length - 1)) {
      throw new Error('Already voted')
    }
    const response = ctx.request.body.response
    const R = new Response({
      userId: user._id,
      pollId: ctx.params.id,
      response: response
    })
    const savedResponse = await R.save()
    let pushData
    if(ctx.request.body.response)
      pushData = {'up': savedResponse._id}
    else
      pushData = {'down': savedResponse._id}
    
    const updatedPoll = await Polls.findByIdAndUpdate(
      ctx.params.id,
      {$push: pushData},
      {safe: true, upsert: true, new : true}
    ).exec()
    const updatedUser = await Users.findByIdAndUpdate(
      user._id,
      {$push: {'attendedPolls': updatedPoll._id}},
      {safe: true, upsert: true, new: true}
    ).exec()
    ctx.body = await {
      success: true
    }
  } catch (error) {
    ctx.body = await {
      success: false,
      error: error.message
    }
  }
}

async function getUsers(ctx, next) {
  try {
    const users = await Users.find({}).exec()
    ctx.body = await {
      success: true,
      data: users
    }
  } catch (error) {
    ctx.body = await {
      success: false,
      error: error
    }
  }
}
async function addUser(ctx, next) {
  try {
    const duplicate = await Users.findOne({userId: ctx.request.body.userId}).exec()
    console.log(duplicate)
    
    if(duplicate)
      throw new Error('이미 등록된 학생입니다')
    if(!ctx.request.body.userId || !ctx.request.body.name)
      throw new Error('올바른 데이터를 입력해 주세요.')
    const newUser = new Users({
      name: ctx.request.body.name,
      userId: ctx.request.body.userId
    })
    const savedUser = await newUser.save()
    ctx.body = await {
      success: true,
      data: savedUser._id
    }
  } catch (error) {
    ctx.body = await {
      success: false,
      error: error.message
    }
  }
}


router
.get('/polls', getPolls)
.post('/polls', addPoll)
.get('/polls/:id', getPoll)
.post('/polls/:id', addVote)
.get('/polls/:id/stats', getPollStats)
.get('/users', getUsers)
.post('/users', addUser)

export default router