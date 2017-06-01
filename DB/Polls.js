import mongoose from 'mongoose'
const Schema = mongoose.Schema

const Poll = new Schema({
  title: String,
  contents: String,
  up: [mongoose.SchemaTypes.ObjectId],
  down:  [mongoose.SchemaTypes.ObjectId],
  votedFPs: [String],
  isDeleted: {type: Boolean, default: false}
})

export default mongoose.model('poll', Poll)