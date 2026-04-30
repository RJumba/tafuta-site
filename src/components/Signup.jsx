import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    console.log("Signup data:", data);
    console.log("New user ID:", data.user?.id);
    console.log("New user email:", data.user?.email);

    alert("Account created successfully!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-5 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-[420px] bg-white rounded-[20px] px-7 py-8 shadow-2xl animate-[fadeIn_1s_ease]">
        <div className="text-center mb-6 text-slate-900">
          <h1 className="text-[2rem] text-slate-900 mb-1.5 font-bold">
            Tafuta
          </h1>
          <p className="text-slate-500 text-sm">
            Create your account to get started
          </p>
        </div>

        <form className="flex flex-col gap-[18px]" onSubmit={handleSignup}>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="name"
              className="text-[0.9rem] text-slate-700 font-semibold"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="px-[14px] py-[14px] rounded-xl border border-slate-300 text-base bg-slate-50 transition-all duration-200 ease-in-out focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/15"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-[0.9rem] text-slate-700 font-semibold"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-[14px] py-[14px] rounded-xl border border-slate-300 text-base bg-slate-50 transition-all duration-200 ease-in-out focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/15"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-[0.9rem] text-slate-700 font-semibold"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="px-[14px] py-[14px] rounded-xl border border-slate-300 text-base bg-slate-50 transition-all duration-200 ease-in-out focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/15"
            />
          </div>

          <button
            className="mt-2.5 p-[14px] border-none rounded-xl bg-blue-600 text-white text-base font-bold cursor-pointer transition-all duration-200 ease-in-out hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          <div className="mt-[18px] text-center">
            <p className="text-[0.9rem] text-slate-500">
              Already have an account?{" "}
              <Link
                to="/"
                className="text-blue-600 font-semibold no-underline hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
