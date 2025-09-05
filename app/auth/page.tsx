/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const { signin, signup, user } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.replace("/home");
    }
  }, [user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    
    try {
      if (mode === "signin") {
        await signin(email, password);
        setMessage("Logged in successfully!");
        router.replace("/home");
      } else {
        await signup(email, password, username);
        setMessage("Signed up successfully! Please sign in.");
        setMode("signin");
        setPassword(""); // Clear password
      }
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  function switchMode() {
    setMode(mode === "signin" ? "signup" : "signin");
    setMessage("");
    setEmail("");
    setPassword("");
    setUsername("");
  }

  if (user) {
    return null; // Prevent flash while redirecting
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {mode === "signin" ? "Sign In" : "Sign Up"}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 p-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Username"
              className="border border-gray-300 p-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          )}
          
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 p-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />

          <button 
            type="submit"
            className="bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : mode === "signin" ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <button
          onClick={switchMode}
          className="w-full mt-4 text-blue-500 hover:text-blue-700 underline"
          disabled={isLoading}
        >
          Switch to {mode === "signin" ? "Sign Up" : "Sign In"}
        </button>

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm text-center ${
            message.includes("success") 
              ? "bg-green-100 text-green-700" 
              : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}
      </div>
    
    </div>
  );
}