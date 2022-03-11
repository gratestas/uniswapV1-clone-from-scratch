import TransactionsTable from '../components/TransactionsTable/index.jsx'

const TransactionHistory = ({ transactions }) => {
  console.log({ transactions })
  return (
    <div className="flex flex-col items-center space-y-5">
      <TransactionsTable transactions={transactions} />
    </div>
  )
}

export default TransactionHistory

export async function getStaticProps(context) {
  const dev = process.env.NODE_ENV !== 'production'
  const { DEV_URL, PROD_URL } = process.env

  // request transactions from api
  const res = await fetch(`${dev ? DEV_URL : PROD_URL}/api/transactions/`)

  const { data } = await res.json()

  return {
    props: {
      transactions: data,
    },
  }
}
