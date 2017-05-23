import mongoose from 'mongoose'
const Schema = mongoose.Schema

const User = new Schema({
  name: String,
  userId: String,
  attendedPolls: [mongoose.SchemaTypes.ObjectId]
})

export default mongoose.model('voteUser', User)