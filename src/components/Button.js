const Button = ({ text, style }) => {
  return (
    <button className={`bg-blue-1 text-[#ffff] px-4 py-1 rounded-2xl ${style}`}>
      {text}
    </button>
  )
}

export default Button