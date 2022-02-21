import { styles } from './styles'

const SearchInput = ({ value, setValue }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className={styles.input}
    />
  )
}

export default SearchInput
