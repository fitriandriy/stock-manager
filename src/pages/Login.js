import { useState } from 'react'
import { jwtDecode } from "jwt-decode";
import { useApp } from '../context'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const { login } = useApp()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await login(username, password)
      
      if (response.data.status === true) {
      const token = response.data.data.token
      const decoded = jwtDecode(token)

      if (decoded.role === 'superadmin') {
        navigate('/home')
      } else {
        navigate('/setting')
      }
    }
    } catch (error) {
      alert("Username atau password salah!")
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex w-fit py-10 px-[80px] lg:shadow-lg lg:shadow-[#656565] text-center rounded-xl bg-white">
        <form onSubmit={handleSubmit}>
          <div className="mb-4 text-left">
            <label className="block mb-2">Username</label>
            <input 
              type="text" 
              className="border w-full p-1 rounded-lg focus:outline-none focus:ring focus:ring-blue-300" 
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4 text-left">
            <label className="block mb-2">Password</label>
            <input 
              type="password" 
              className="border w-full p-1 rounded-lg focus:outline-none focus:ring focus:ring-blue-300" 
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            className={"bg-blue-1 w-full text-[#ffff] px-4 py-1 rounded-xl font-semibold m-auto"}
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
