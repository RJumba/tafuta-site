import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`Welcome, ${name || 'User'}!`)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex justify-center items-center p-5 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-[420px] bg-white rounded-[20px] px-7 py-8 shadow-2xl animate-[fadeIn_1s_ease]">
        <div className="text-center mb-6 text-slate-900">
          <h1 className="text-[2rem] text-slate-900 mb-1.5 font-bold">Tafuta</h1>
        </div>

        <form className="flex flex-col gap-[18px]" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-[0.9rem] text-slate-700 font-semibold">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-[14px] py-[14px] rounded-xl border border-slate-300 text-base bg-slate-50 transition-all duration-200 ease-in-out focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/15"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-[0.9rem] text-slate-700 font-semibold">
              Email
            </label>
            <input
              id="email"
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-[14px] py-[14px] rounded-xl border border-slate-300 text-base bg-slate-50 transition-all duration-200 ease-in-out focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/15"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-[0.9rem] text-slate-700 font-semibold">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-[14px] py-[14px] rounded-xl border border-slate-300 text-base bg-slate-50 transition-all duration-200 ease-in-out focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/15"
            />
          </div>

          <button
            className="mt-2.5 p-[14px] border-none rounded-xl bg-blue-600 text-white text-base font-bold cursor-pointer transition-all duration-200 ease-in-out hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0"
            type="submit"
          >
            Login
          </button>

          <div className="mt-[18px] text-center">
            <p className="text-[0.9rem] text-slate-500">
              Don't have an account?{' '}
              <a href="/signup" className="text-blue-600 font-semibold no-underline hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login