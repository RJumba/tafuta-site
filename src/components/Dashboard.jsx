import name from './Login'

function Dashboard() {
    const profilePic = "https://via.placeholder.com/60"
    const handleLogout = (e) => {
        e.preventDefault()
        
            alert('Logged out successfully!')
        }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Welcome, {name}!</h1>
                {profilePic && <img src={profilePic} alt="Profile" className="profile-pic" />}
            </div>

            <div>
                <button onClick={handleLogout} className="logoutbtn">Logout</button>
            </div>
        </div>
    )
}

export default Dashboard
