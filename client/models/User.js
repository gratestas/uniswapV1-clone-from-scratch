import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  address: String,
  transactions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Transaction',
    },
  ],
})

const User = mongoose.model('User', userSchema)
export default User
