import mongoose from 'mongoose'
const Schema = mongoose.Schema

const Response = new Schema({
  userId: mongoose.SchemaTypes.ObjectId,
  pollId: mongoose.SchemaTypes.ObjectId,
  response: Boolean,
  ipAddr: String
})

export default mongoose.model('response', Response)