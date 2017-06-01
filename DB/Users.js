import mongoose from 'mongoose'
const Schema = mongoose.Schema

const User = new Schema({
  name: String,
  userName: String,
  password: String,
  userId: String,
  email: String,
  verifyHash: String,
  privilege: [String],
  attendedPolls: [mongoose.SchemaTypes.ObjectId]
})

export default mongoose.model('voteUser', User)