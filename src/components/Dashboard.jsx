import { useState } from 'react'

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const user = {
    name: 'Ian',
    email: 'ian@example.com',
    profilePic: 'https://via.placeholder.com/60',
  }

  const handleLogout = () => {
    alert('Logged out successfully!')
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside
        className={`bg-slate-900 text-white flex flex-col justify-between p-4 shadow-xl transition-all duration-300 ${
          isSidebarOpen ? 'w-72' : 'w-20'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-6">
            {isSidebarOpen && <h2 className="text-lg font-bold">Tafuta</h2>}
            <button
            type='button'
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-slate-700 hover:bg-slate-600 text-white border border-slate-500"
            >
              {isSidebarOpen ? '←' : '→'}
            </button>
          </div>

          <div className="flex flex-col items-center border-b border-slate-700 pb-6">
            <img
              src={user.profilePic}
              alt="Profile"
              className="w-14 h-14 rounded-full object-cover border-2 border-blue-500"
            />
            {isSidebarOpen && (
              <>
                <h2 className="mt-3 text-base font-bold">{user.name}</h2>
                <p className="text-sm text-slate-300 text-center">{user.email}</p>
              </>
            )}
          </div>

          <nav className="mt-6 space-y-3">
            <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-800 transition">
              <span>🏠</span>
              {isSidebarOpen && <span>Dashboard</span>}
            </button>

            <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-800 transition">
              <span>👤</span>
              {isSidebarOpen && <span>Profile</span>}
            </button>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-red-500 hover:bg-red-600 transition"
        >
          <span>🚪</span>
          {isSidebarOpen && <span>Logout</span>}
        </button>
      </aside>

      <main className="flex-1 p-8">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Welcome, {user.name}!
          </h1>
          <p className="mt-3 text-slate-600">
            This is your dashboard main area.
          </p>
        </div>
      </main>
    </div>
  )
}

export default Dashboard