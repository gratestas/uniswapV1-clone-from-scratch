import TransactionsTable from '../../components/TransactionsTable/index.jsx'
import { connectToDatabase } from '../../util/mongoDB'
import User from '../../models/User'

const TransactionHistory = ({ transactions }) => {
  console.log({ transactions })
  return (
    <div className="flex flex-col items-center space-y-5">
      <TransactionsTable transactions={transactions} />
    </div>
  )
}

export default TransactionHistory

export async function getStaticPaths() {
  //connect to db
  await connectToDatabase()
  // returns an array of all existing users with only selected field name
  const users = await User.find().select('_id')

  const paths = users.map((user) => ({
    params: { userId: user._id },
  }))

  return {
    paths,
    fallback: true,
  }
}

export async function getStaticProps({ params }) {
  const { userId } = params
  const dev = process.env.NODE_ENV !== 'production'
  const { DEV_URL, PROD_URL } = process.env

  // request transactions from api
  const res = await fetch(
    `${dev ? DEV_URL : PROD_URL}/api/transactions/${userId}`
  )

  const { data } = await res.json()

  return {
    props: {
      transactions: data,
    },
  }
}
