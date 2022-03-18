import TransactionsTable from '../../components/TransactionsTable/index.jsx'
import { connectToDatabase } from '../../util/mongoDB'
import User from '../../models/User'
import Transaction from '../../models/Transaction'

const TransactionHistory = ({ transactions }) => {
  console.log({ transactions })
  return (
    <>
      {transactions ? (
        <div className="flex flex-col items-center space-y-5">
          <TransactionsTable transactions={transactions} />
        </div>
      ) : (
        <div>You have not done any transactions yet</div>
      )}
    </>
  )
}

export default TransactionHistory

export async function getServerSideProps({ params }) {
  const { userId } = params

  await connectToDatabase()

  const doesUserExist = await User.exists({ _id: userId })
  let transactions
  if (doesUserExist) {
    const user = await User.findById(userId).populate('transactions')
    transactions = user.transactions
  } else {
    transcations = null
  }

  return {
    props: {
      transactions: JSON.parse(JSON.stringify(transactions)),
    },
  }
}
