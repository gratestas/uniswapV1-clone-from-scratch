import { css } from '@emotion/react'
import { MoonLoader } from 'react-spinners'
import { BsCheckCircle } from 'react-icons/bs'

const style = {
  wrapper: `text-white h-full w-full ml-5 flex flex-col items-center  rounded-xl`,
  title: `font-semibold text-xl mt-16 mb-16`,
}

const cssOverride = css`
  display: flex;
  margin: 0 auto;
  box-sizing: content-box;
  border-color: white;
`

const TransactionLoader = ({ message, isLoading }) => {
  return (
    <div className={style.wrapper}>
      <div className={style.title}>{message}</div>
      <MoonLoader
        color={'#4E96F1'}
        loading={isLoading}
        css={cssOverride}
        size={60}
      />
      {!isLoading && (
        <div>
          <BsCheckCircle
            style={{ width: '8rem', height: '8rem', color: 'green' }}
          />
        </div>
      )}
    </div>
  )
}

export default TransactionLoader
