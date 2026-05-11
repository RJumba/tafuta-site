import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import {
  LayoutDashboard,
  History,
  Menu,
  User,
  Settings,
  LogOut,
  Sliders,
} from "lucide-react";

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");

  const [user, setUser] = useState(null);
  const fileInputRef = useRef(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const loadUserProfile = async () => {
    const {
      data: { user: authUser },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !authUser) {
      console.log("No logged-in user found");
      navigate("/");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name, email, avatar_url, city, area")
      .eq("id", authUser.id)
      .maybeSingle();

    if (profileError) {
      console.error("Profile fetch error:", profileError.message);
    }

    setUser({
      id: authUser.id,
      name:
        profile?.full_name ||
        authUser.user_metadata?.name ||
        authUser.email?.split("@")[0] ||
        "User",
      email: profile?.email || authUser.email,
      profilePic: profile?.avatar_url || null,
      avatar_url: profile?.avatar_url || null,
      city: profile?.city || "",
      area: profile?.area || "",
    });
  };

  useEffect(() => {
    const initDashboard = async () => {
      await loadUserProfile();
    };

    initDashboard();
  }, [navigate]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-700">
        Loading dashboard...
      </div>
    );
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
    alert("Logged out successfully!");
  };

  const handleProfilePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!user?.id) {
      alert("You must be logged in first.");
      return;
    }

    setUploadingPhoto(true);

    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}/avatar-${Date.now()}.${fileExt}`;

    console.log("Current user:", user);
    console.log("Uploading to file path:", filePath);

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setUploadingPhoto(false);
      console.error("UPLOAD ERROR:", uploadError);
      alert("Upload error: " + uploadError.message);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    const avatarUrl = data.publicUrl;

    const { error: updateError } = await supabase.from("profiles").upsert({
      id: user.id,
      email: user.email,
      full_name: user.name,
      avatar_url: avatarUrl,
    });

    setUploadingPhoto(false);

    if (updateError) {
      console.error("PROFILE UPDATE ERROR:", updateError);
      alert("Profile update error: " + updateError.message);
      return;
    }

    setUser((prev) => ({
      ...prev,
      profilePic: avatarUrl,
      avatar_url: avatarUrl,
    }));
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside
        className={`bg-slate-900 text-white flex flex-col justify-between p-4 shadow-xl transition-all duration-300 ${
          isSidebarOpen ? "w-72" : "w-20"
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-6">
            {isSidebarOpen && <h2 className="text-lg font-bold">Tafuta</h2>}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-slate-700 hover:bg-slate-600 text-white border border-slate-500"
            >
              <Menu size={20} />
            </button>
          </div>

          <div className="flex flex-col items-center border-b border-slate-700 pb-6">
            <div className="w-14 h-14 rounded-full border-2 border-blue-500 flex items-center justify-center bg-slate-200 overflow-hidden">
              {user?.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-7 h-7 text-slate-500" />
              )}
            </div>

            {isSidebarOpen && (
              <>
                <h2 className="mt-3 text-base font-bold text-center">
                  {user?.name}
                </h2>
                <p className="text-sm text-slate-300 text-center break-all">
                  {user?.email}
                </p>
              </>
            )}
          </div>

          <nav className="mt-6 space-y-3">
            <button
              onClick={() => setActiveSection("dashboard")}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl  ${
                activeSection === "dashboard"
                  ? "bg-slate-700"
                  : "hover:bg-slate-800 transition"
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

      <div className="flex-1 flex flex-col">
        <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Tafuta</h1>
          <input
            className="bg-slate-900 text-slate-300 placeholder:text-slate-500 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl p-3 focus:border-blue-500 w-80 transition"
            type="text"
            placeholder="Search houses, locations,etc..."
          />
        </div>

        <main className="flex-1 p-8">
          {activeSection === "dashboard" && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                  Dashboard
                </h1>
                <p className="text-slate-600">
                  Welcome back, {user?.name}. Here is a quick overview of your
                  housing activity.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-slate-800">
                      Saved Homes
                    </h2>
                    <span className="text-sm bg-sky-100 text-sky-700 px-3 py-1 rounded-full">
                      12 Homes
                    </span>
                  </div>
                  <p className="text-slate-600 mb-6">
                    Homes you have saved for later comparison and review.
                  </p>

                  <div className="space-y-3">
                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="font-medium text-slate-800">
                        2 Bedroom Apartment - Kilimani
                      </p>
                      <p className="text-sm text-slate-500">KES 45,000/month</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="font-medium text-slate-800">
                        Studio Apartment - Westlands
                      </p>
                      <p className="text-sm text-slate-500">KES 30,000/month</p>
                    </div>
                  </div>

                  <button className="mt-6 px-4 py-2 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition">
                    View Saved Homes
                  </button>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-slate-800">
                      Recently Viewed
                    </h2>
                    <span className="text-sm bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
                      8 Viewed
                    </span>
                  </div>
                  <p className="text-slate-600 mb-6">
                    Listings you recently checked and may want to revisit.
                  </p>

                  <div className="space-y-3">
                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="font-medium text-slate-800">
                        1 Bedroom House - Syokimau
                      </p>
                      <p className="text-sm text-slate-500">KES 25,000/month</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="font-medium text-slate-800">
                        Bedsitter - South B
                      </p>
                      <p className="text-sm text-slate-500">KES 18,000/month</p>
                    </div>
                  </div>

                  <button className="mt-6 px-4 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-900 transition">
                    Open Recent Views
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl shadow-md p-5 border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">
                    Popular Locations
                  </h3>
                  <ul className="space-y-2 text-slate-600">
                    <li>Kilimani</li>
                    <li>Westlands</li>
                    <li>Syokimau</li>
                  </ul>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-5 border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">
                    Budget Overview
                  </h3>
                  <p className="text-slate-600">Min: KES 20,000</p>
                  <p className="text-slate-600">Max: KES 60,000</p>
                  <p className="text-slate-600">Target: 1–2 Bedroom</p>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-5 border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">
                    Search Activity
                  </h3>
                  <p className="text-3xl font-bold text-sky-600">24</p>
                  <p className="text-slate-600 mt-2">Searches made this week</p>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-5 border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">
                    New Matches
                  </h3>
                  <p className="text-3xl font-bold text-emerald-600">6</p>
                  <p className="text-slate-600 mt-2">
                    New homes matching your preferences
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === "profile" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                  My Profile
                </h1>
                <p className="text-slate-600">
                  View your personal and location details here.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <div className="flex items-center gap-6 mb-6">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleProfilePhotoChange}
                      className="hidden"
                      accept="image/*"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingPhoto}
                      className="w-24 h-24 rounded-full border-4 border-sky-500 flex items-center justify-center bg-slate-200 overflow-hidden"
                    >
                      {user?.profilePic ? (
                        <img
                          src={user.profilePic}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-10 h-10 text-slate-500" />
                      )}
                    </button>
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-800">
                        {user?.name}
                      </h2>
                      <p className="text-slate-600">
                        {user?.role || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 text-slate-700">
                    <div>
                      <p className="font-semibold">Email</p>
                      <p>{user?.email}</p>
                    </div>

                    <div>
                      <p className="font-semibold">Phone</p>
                      <p>{user?.phone || "Not specified"}</p>
                    </div>

                    <div>
                      <p className="font-semibold">Role</p>
                      <p>{user?.role || "Not specified"}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h2 className="text-2xl font-semibold text-slate-800 mb-6">
                    Location Details
                  </h2>

                  <div className="space-y-4 text-slate-700">
                    <div>
                      <p className="font-semibold">City</p>
                      <p>{user?.city || "Not specified"}</p>
                    </div>

                    <div>
                      <p className="font-semibold">Constituency</p>
                      <p>{user?.constituency || "Not specified"}</p>
                    </div>

                    <div>
                      <p className="font-semibold">Area</p>
                      <p>{user?.area || "Not specified"}</p>
                    </div>

                    <div>
                      <p className="font-semibold">Full Location</p>
                      <p>
                        {user?.city && user?.constituency && user?.area
                          ? `${user.city}, ${user.constituency}, ${user.area}`
                          : "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "settings" && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                  Settings
                </h1>
                <p className="text-slate-600">
                  Manage your account preferences, privacy, notifications, and
                  display options.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200">
                  <h2 className="text-xl font-semibold text-slate-800 mb-2">
                    Account Settings
                  </h2>
                  <p className="text-slate-600 mb-6">
                    Update your basic account information.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.name}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-sky-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        defaultValue={user?.email}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-sky-400"
                      />
                    </div>

                    <button className="px-5 py-3 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition">
                      Save Account Changes
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200">
                  <h2 className="text-xl font-semibold text-slate-800 mb-2">
                    Notification Settings
                  </h2>
                  <p className="text-slate-600 mb-6">
                    Choose what updates Tafuta should notify you about.
                  </p>

                  <div className="space-y-4">
                    <label className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50">
                      <div>
                        <p className="font-medium text-slate-800">
                          New listings
                        </p>
                        <p className="text-sm text-slate-500">
                          Get notified when new homes match your preferences.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-5 h-5"
                      />
                    </label>

                    <label className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50">
                      <div>
                        <p className="font-medium text-slate-800">
                          Price drops
                        </p>
                        <p className="text-sm text-slate-500">
                          Get alerts when saved homes reduce in price.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-5 h-5"
                      />
                    </label>

                    <label className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50">
                      <div>
                        <p className="font-medium text-slate-800">
                          Viewing reminders
                        </p>
                        <p className="text-sm text-slate-500">
                          Remind me about upcoming house viewings.
                        </p>
                      </div>
                      <input type="checkbox" className="w-5 h-5" />
                    </label>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200">
                  <h2 className="text-xl font-semibold text-slate-800 mb-2">
                    Privacy Settings
                  </h2>
                  <p className="text-slate-600 mb-6">
                    Control how visible your information is.
                  </p>

                  <div className="space-y-4">
                    <label className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50">
                      <div>
                        <p className="font-medium text-slate-800">
                          Show my profile photo
                        </p>
                        <p className="text-sm text-slate-500">
                          Allow your profile photo to appear on your account.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-5 h-5"
                      />
                    </label>

                    <label className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50">
                      <div>
                        <p className="font-medium text-slate-800">
                          Save search history
                        </p>
                        <p className="text-sm text-slate-500">
                          Let Tafuta remember your recently viewed homes and
                          searches.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-5 h-5"
                      />
                    </label>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200">
                  <h2 className="text-xl font-semibold text-slate-800 mb-2">
                    Display Settings
                  </h2>
                  <p className="text-slate-600 mb-6">
                    Adjust how your dashboard looks.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Theme
                      </label>
                      <select className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-sky-400">
                        <option>Light Mode</option>
                        <option>Dark Mode</option>
                        <option>System Default</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Default Landing Section
                      </label>
                      <select className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-sky-400">
                        <option>Dashboard</option>
                        <option>Saved Homes</option>
                        <option>Recently Viewed</option>
                        <option>Preferences</option>
                      </select>
                    </div>

                    <button className="px-5 py-3 rounded-xl bg-slate-800 text-white hover:bg-slate-900 transition">
                      Save Display Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "history" && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                  Search History
                </h1>
                <p className="text-slate-600">
                  View the houses, locations, and filters you have searched
                  recently.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow-md p-5 border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800">
                    Total Searches
                  </h3>
                  <p className="text-3xl font-bold text-sky-600 mt-3">24</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Searches this week
                  </p>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-5 border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800">
                    Most Searched Area
                  </h3>
                  <p className="text-3xl font-bold text-emerald-600 mt-3">
                    Kilimani
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Based on recent activity
                  </p>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-5 border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800">
                    Last Search
                  </h3>
                  <p className="text-xl font-bold text-slate-800 mt-3">
                    2 Bedroom
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Westlands • KES 45,000
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-xl font-semibold text-slate-800">
                    Recent Searches
                  </h2>
                  <p className="text-slate-600 mt-1">
                    Your latest house-search activity.
                  </p>
                </div>

                <div className="divide-y divide-slate-200">
                  <div className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        2 Bedroom Apartment
                      </h3>
                      <p className="text-sm text-slate-500">
                        Location: Kilimani • Budget: KES 35,000 - KES 55,000
                      </p>
                    </div>
                    <button className="px-4 py-2 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition">
                      Search Again
                    </button>
                  </div>

                  <div className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        Studio Apartment
                      </h3>
                      <p className="text-sm text-slate-500">
                        Location: Westlands • Budget: KES 25,000 - KES 40,000
                      </p>
                    </div>
                    <button className="px-4 py-2 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition">
                      Search Again
                    </button>
                  </div>

                  <div className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        Bedsitter
                      </h3>
                      <p className="text-sm text-slate-500">
                        Location: South B • Budget: KES 12,000 - KES 22,000
                      </p>
                    </div>
                    <button className="px-4 py-2 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition">
                      Search Again
                    </button>
                  </div>

                  <div className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        One Bedroom House
                      </h3>
                      <p className="text-sm text-slate-500">
                        Location: Syokimau • Budget: KES 20,000 - KES 35,000
                      </p>
                    </div>
                    <button className="px-4 py-2 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition">
                      Search Again
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">
                  Top Locations Searched
                </h2>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-700">Kilimani</span>
                      <span className="text-slate-500">9 searches</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-sky-500 rounded-full"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-700">Westlands</span>
                      <span className="text-slate-500">7 searches</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-emerald-500 rounded-full"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-700">Syokimau</span>
                      <span className="text-slate-500">5 searches</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full w-1/2 bg-amber-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "preferences" && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                  Preferences
                </h1>
                <p className="text-slate-600">
                  Set your housing preferences so Tafuta can show you listings
                  that match your needs.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200">
                  <h2 className="text-xl font-semibold text-slate-800 mb-2">
                    Budget Preference
                  </h2>
                  <p className="text-slate-600 mb-6">
                    Set the minimum and maximum rent you are comfortable with.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Minimum Rent
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 15000"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-sky-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Maximum Rent
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 50000"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-sky-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200">
                  <h2 className="text-xl font-semibold text-slate-800 mb-2">
                    Preferred Locations
                  </h2>
                  <p className="text-slate-600 mb-6">
                    Add up to three locations where you would like to find a
                    home.
                  </p>

                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="First choice location"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-sky-400"
                    />
                    <input
                      type="text"
                      placeholder="Second choice location"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-sky-400"
                    />
                    <input
                      type="text"
                      placeholder="Third choice location"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200">
                <h2 className="text-xl font-semibold text-slate-800 mb-2">
                  Housing Type
                </h2>
                <p className="text-slate-600 mb-6">
                  Select the type of housing you are interested in.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <button className="px-4 py-3 rounded-xl border border-slate-300 hover:bg-sky-50 hover:border-sky-400 transition text-slate-700">
                    Bedsitter
                  </button>
                  <button className="px-4 py-3 rounded-xl border border-slate-300 hover:bg-sky-50 hover:border-sky-400 transition text-slate-700">
                    Studio Apartment
                  </button>
                  <button className="px-4 py-3 rounded-xl border border-slate-300 hover:bg-sky-50 hover:border-sky-400 transition text-slate-700">
                    One Bedroom
                  </button>
                  <button className="px-4 py-3 rounded-xl border border-slate-300 hover:bg-sky-50 hover:border-sky-400 transition text-slate-700">
                    Two Bedroom
                  </button>
                  <button className="px-4 py-3 rounded-xl border border-slate-300 hover:bg-sky-50 hover:border-sky-400 transition text-slate-700">
                    Three Bedroom
                  </button>
                  <button className="px-4 py-3 rounded-xl border border-slate-300 hover:bg-sky-50 hover:border-sky-400 transition text-slate-700">
                    Single Room
                  </button>
                  <button className="px-4 py-3 rounded-xl border border-slate-300 hover:bg-sky-50 hover:border-sky-400 transition text-slate-700">
                    Maisonette
                  </button>
                  <button className="px-4 py-3 rounded-xl border border-slate-300 hover:bg-sky-50 hover:border-sky-400 transition text-slate-700">
                    Bungalow
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
