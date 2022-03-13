import { connectToDatabase } from '../../../util/mongoDB'
import Transaction from '../../../controllers/transaction'

export default async (req, res) => {
  const { method } = req

  await connectToDatabase()

  switch (method) {
    case 'GET':
      Transaction.getByUserId(req, res)
      break
    case 'POST':
      Transaction.add(req, res)
      break
    default:
      res.status(400).json({ success: false })
  }
}
