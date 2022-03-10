import { connectToDatabase } from '../../util/mongoDB'
import Transaction from '../../models/Transaction'

export default handler = async (req, res) => {
  const { method } = req

  await connectToDatabase()

  switch (method) {
    case 'GET':
      getTransactions(req, res)
      break
    case 'POST':
      addTransaction(req, res)
      break
    default:
      res.status(400).json({ success: false })
  }
}

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({})
    res.status(200).json({ success: true, data: transactions })
  } catch (error) {
    res.status(400).json({ succes: false, data: error.message })
  }
}

const addTransaction = async (req, res) => {}
