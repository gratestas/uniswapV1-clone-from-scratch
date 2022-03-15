import TransactionLoader from '../TransactionLoader'

const styles = {
  wrapper: `absolute inset-x-auto z-20 flex top-10 h-96 w-[40rem] flex-col justify-between rounded-2xl bg-[#191B1F] py-10 px-20 text-center`,
}

const TransactionModal = ({ isOpen, isLoading, message }) => {
  return (
    <div>
      {isOpen && (
        <div className={styles.wrapper}>
          <TransactionLoader message={message} isLoading={isLoading} />
        </div>
      )}
    </div>
  )
}

export default TransactionModal
