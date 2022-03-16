import TransactionLoader from '../TransactionLoader'

const styles = {
  wrapper: `absolute inset-x-auto z-20 flex top-0 left-6 h-96 w-[35rem] flex-col justify-between items-center rounded-2xl bg-[#191B1F] text-center`,
}

const TransactionModal = ({ isOpen, isLoading, message }) => {
  return (
    <>
      {isOpen && (
        <div className={styles.wrapper}>
          <TransactionLoader message={message} isLoading={isLoading} />
        </div>
      )}
    </>
  )
}

export default TransactionModal
