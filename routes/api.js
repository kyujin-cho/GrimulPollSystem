import Router from 'koa-router'
import Polls from '../DB/Polls'
import Users from '../DB/Users'
import Response from '../DB/Responses'
import ensure from '../middlewares/ensure'
import admin from '../middlewares/admin'
import nodemailer from 'nodemailer'
import SHA256 from '../include/SHA256'

const router = new Router({prefix: '/api'})

const gmailTransport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'hy.grimul@gmail.com',
    pass: 'LnF-75k-qhP-Yat'
  }
})

async function getPolls (ctx, next) {
  try {
    const polls = await Polls.find().exec()
    let newPolls
    if(ctx.state.user.privilege.indexOf('administrator') !== -1)
      newPolls = polls.map((poll, index) => {
        return {
          _id: poll._id,
          title: poll.title,
          contents: poll.contents,
          upCount: poll.up.length,
          downCount: poll.down.length
        }
      })
    else
      newPolls = polls.map((poll, index) => {
        return {
          _id: poll._id,
          title: poll.title,
          contents: poll.contents
        }
      })
    ctx.body = await {
      success: true,
      data: newPolls
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

async function deletePoll(ctx, next) {
  try {
    await Polls.remove({_id: ctx.params.id}).exec()
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
    const user = await Users.findOne({_id: ctx.state.user._id}).exec()
    if(user === null || user === undefined) 
      throw new Error('No such user')
    const poll = await Polls.findOne({_id: ctx.params.id}).exec()
    let i = 0
    let j = 0
    user.attendedPolls.forEach(function(poll, index) {
      console.log(poll)
      
      console.log(index + ': ' + poll)
      console.log(poll.toString() === ctx.params.id)
      if(poll.toString() === ctx.params.id)
        return false
      i++
    })
    console.log(i + ', ' + user.attendedPolls.length)
    
    poll.votedFPs.forEach(function(fp, index) {
      console.log(fp)
      
      console.log(index + ': ' + fp)
      if(fp.toString() === ctx.request.body.fingerprint)
        return false
      j++
    })
    if(i !== (user.attendedPolls.length) || j !== (poll.votedFPs.length)) {
      throw new Error('Can\'t make two or more votes on same device')
    }
    const response = ctx.request.body.response
    const R = new Response({
      userId: user._id,
      pollId: ctx.params.id,
      response: response,
      ipAddr: ctx.request.ip
    })
    const savedResponse = await R.save()
    let pushData
    if(ctx.request.body.response)
      pushData = {'up': savedResponse._id}
    else
      pushData = {'down': savedResponse._id}
    pushData.votedFPs = ctx.request.body.fingerprint
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
    let userData = {
      name: ctx.request.body.name,
      userId: ctx.request.body.userId,
      email: ctx.request.body.email,
      password: SHA256(ctx.request.body.password)
    }
    userData.verifyHash = SHA256(
        Math.random() * (10 ** 8).toString() 
        + userData.userId.slice((userData.userId.length - 1) / 2)
        + Math.random() * (10 ** 8).toString()
        + userData.userId.slice(0, (userData.userId.length - 1) / 2)
    )
    const newUser = new Users(userData)

    const savedUser = await newUser.save()
    const URL = 'http://grimul.duckdns.org/api/users/' + savedUser._id + '/verify?verifyHash=' + newUser.verifyHash
    const sentMail = await gmailTransport.sendMail({
      from: 'Do Not Reply <hy.grimul@gmail.com>',
      to: userData.email,
      subject: 'Confirm your account',
      html: '<p>Please verify your account by clicking <a href="' + URL + '">this link</a>. If you are unable to do so, copy and ' +
      'paste the following link into your browser:</p><p>' + URL + '</p>',
      text: 'Please verify your account by clicking the following link, or by copying and pasting it into your browser: ' + URL
    })
    console.log('Verification mail sent:' + sentMail.response)
    
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

async function verifyUser(ctx, next) {
  try {
    const user = await Users.findOne({_id: ctx.params.id}).exec()
    if(user === null)
      throw new Error('No such user')
    if(user.verifyHash === '') 
      throw new Error('Already Verified')
    
    console.log('My hash: ' + user.verifyHash)
    console.log('Ur hash: ' + ctx.query.verifyHash)
    
    if(user.verifyHash !== ctx.query.verifyHash) 
      throw new Error('Hash doesn\'t match')
    
    await Users.findByIdAndUpdate(ctx.params.id,{
      verifyHash: ''
    })
    ctx. body = await {
      success: true
    }
    const sentMail = await gmailTransport.sendMail({
      from: 'Do Not Reply <hy.grimul@gmail.com>',
      to: user.email,
      subject: 'Successfully verified!',
      html: '<p>Your account has been successfully verified.</p>',
      text: 'Your account has been successfully verified.'
    })
    console.log('Confirmation mail sent: ' + sentMail.response)
    
  } catch(err) {
    ctx.body = await {
      success: false,
      err: err.message
    }
  }
}
router
.get('/polls', ensure, getPolls)
.post('/polls', admin, addPoll)
.get('/polls/:id', ensure, getPoll)
.post('/polls/:id', ensure, addVote)
.del('/polls/:id', admin, deletePoll)
.get('/polls/:id/stats', admin, getPollStats)
.post('/users', addUser)
.get('/users', admin, getUsers)
.get('/users/:id/verify', verifyUser)

export default router