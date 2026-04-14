import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, History, Menu, User, Settings, LogOut, Sliders } from 'lucide-react'


function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('dashboard')

  const user = {
    name: 'Jumba Ray',
    email: 'jumba@example.com',
    profilePic: 'https://via.placeholder.com/60',
  }

  const handleLogout = () => {
    navigate('/')
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
              <Menu size={20}/>
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
            <button
            onClick={() => setActiveSection('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl  ${
                activeSection === 'dashboard' 
                ? 'bg-slate-700' 
                : 'hover:bg-slate-800 transition'
              }`}
            >
              <LayoutDashboard size={20} />
              {isSidebarOpen && <span>Dashboard</span>}
            </button>

            <button
              onClick={() => setActiveSection("profile")}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition ${
              activeSection === "profile"
                ? "bg-sky-500 text-white"
                : "hover:bg-slate-800"
            }`}
            >
              <User size={20} />
              {isSidebarOpen && <span>Profile</span>}
            </button>

            <button
              onClick={() => setActiveSection("preferences")}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition ${
                activeSection === "preferences"
                  ? "bg-sky-500 text-white"
                  : "hover:bg-slate-800"
              }`}
            >
              <Sliders size={20} />
              {isSidebarOpen && <span>Preferences</span>}
            </button>

            <button
               onClick={() => setActiveSection("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              activeSection === "settings"
                ? "bg-sky-500 text-white"
                : "hover:bg-slate-800"
            }`}
            >
              <Settings size={20} />
              {isSidebarOpen && <span>Settings</span>}
            </button>

            <button
            onClick={() => setActiveSection("history")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              activeSection === "history"
                ? "bg-sky-500 text-white"
                : "hover:bg-slate-800"
            }`}
          >
            <History size={20} />
            {isSidebarOpen && <span>Search History</span>}
          </button>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-red-500 hover:bg-red-600 transition"
        >
          <LogOut size={20} />
          {isSidebarOpen && <span>Logout</span>}
        </button>
      </aside>
      
      <div>

      <main className="flex-1 p-8">
        {activeSection === "dashboard" && (
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Dashboard</h1>
            <p className="text-slate-600">
              Welcome to your dashboard. This is the main overview page.
            </p>
          </div>
        )}

        {activeSection === "profile" && (
          <div className="bg-white rounded-2xl shadow-md p-6 max-w-2xl">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">My Profile</h1>

            <div className="flex items-center gap-6 mb-6">
              <img
                src={user.profilePic}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-sky-500"
              />
              <div>
                <h2 className="text-2xl font-semibold text-slate-800">{user.name}</h2>
                <p className="text-slate-600">{user.role || 'Not specified'}</p>
              </div>
            </div>

            <div className="space-y-4 text-slate-700">
              <div>
                <p className="font-semibold">Email</p>
                <p>{user.email}</p>
              </div>

              <div>
                <p className="font-semibold">Phone</p>
                <p>{user.phone || 'Not specified'}</p>
              </div>

              <div>
                <p className="font-semibold">Role</p>
                <p>{user.role || 'Not specified'}</p>
              </div>
            </div>
          </div>
        )}

        {activeSection === "settings" && (
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Settings</h1>
            <p className="text-slate-600">Your settings page will appear here.</p>
          </div>
        )}

        {activeSection === "history" && (
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Search History</h1>
            <p className="text-slate-600">Your search history will appear here.</p>
          </div>
        )}

        {activeSection === "preferences" && (
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Preferences</h1>
            <p className="text-slate-600">Your preferences page will appear here.</p>
          </div>
        )}
      </main>
      </div>
    </div>
  )
}

export default Dashboard