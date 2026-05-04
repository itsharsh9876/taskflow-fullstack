import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const { login } = useAuth();

  const [isSignup, setIsSignup] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async () => {
    if (isSignup) {
      // 🔹 Signup API
      await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });
      

      alert("Signup successful! Now login.");
      setIsSignup(false);
    } else {
      // 🔹 Login
      await login(email, password);
    }
  };

 return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
    <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-sm">

      <h2 className="text-2xl font-bold text-center mb-6">
        {isSignup ? "Create Account" : "Welcome Back"}
      </h2>

      {isSignup && (
        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}

      <input
        className="w-full border p-2 rounded mb-3"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="w-full border p-2 rounded mb-4"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        {isSignup ? "Sign Up" : "Login"}
      </button>

      <p className="text-center text-sm mt-4">
        {isSignup ? "Already have an account?" : "New here?"}
      </p>

      <button
        onClick={() => setIsSignup(!isSignup)}
        className="text-blue-600 text-sm w-full mt-1 hover:underline"
      >
        {isSignup ? "Go to Login" : "Create new account"}
      </button>

    </div>
  </div>
);
}