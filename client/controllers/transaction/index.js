import Transaction from '../../models/Transaction'
import User from '../../models/User'

module.exports = {
  getByUserId: async (req, res) => {
    const id = req.query.userId
    let user
    try {
      const doesUserExist = await User.exists({ _id: id })
      if (doesUserExist) {
        user = await User.findById(id).populate('transactions')
        res.status(200).json({ success: true, data: user.transactions })
      } else {
        res.status(200).json({ success: true, data: null })
      }
    } catch (error) {
      res.status(400).json({ success: false, data: error.message })
    }
  },
  add: async (req, res) => {
    const id = req.query.userId
    const tx = req.body
    try {
      const transaction = await Transaction.create(tx)
      await transaction.save()

      const doesUserExist = await User.exists({ _id: id })
      if (doesUserExist) {
        console.log('user does exist')
        const userById = await User.findById(id)
        userById.transactions.push(transaction)
        await userById.save()
        res.status(201).json({ success: true, data: userById })
      } else {
        console.log('creating new user')
        const newUser = await User.create({
          _id: id,
          address: id,
        })
        newUser.transactions.push(transaction)
        await newUser.save()
        res.status(201).json({ success: true, data: newUser })
      }
    } catch (error) {
      res.status(400).json({ success: false, data: error.message })
    }
  },
}
