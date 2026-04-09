import { useState } from 'react'

function Login() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    alert (`Welcome, ${name || "User"}!`)
  }

  return (
    <div className='login-page'>
        <div className='login-card'>


            <div className='login-header'>
            <h1>Tafuta</h1>
            </div>


      <form className='login-form' onSubmit={handleSubmit}>
        <div className='infotile'>
            <label htmlFor="name">Name</label>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        </div>

        
        <div className='infotile'>
            <label htmlFor="email">Email</label>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        </div>

        <div className='infotile'>
            <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        </div>

        <button className='loginBtn'>Login</button>

        <div className='login-footer'>
            <p>Don't have an account? <a href="/signup">Sign up</a></p>
        </div>

      </form>
            
        </div>
    </div>
  )
}

export default Login