import mongoose from 'mongoose'

const connection = {}

//TODO: need to implement db caching
//to prevent connections from growing exponentially during API calls

export const connectToDatabase = async (req, res) => {
  //checks if there is an active connection
  if (connection.isConnected) return

  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, opts)
    connection.isConnected = db.connections[0].readyState
    console.log('connected to db:', connection.isConnected)
  } catch (error) {
    console.log('db error:', error)
  }
}
