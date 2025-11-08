"use client"

import { createContext, useContext, useState, useEffect } from "react"

// Create the authentication context to share user state across the app
const AuthContext = createContext()

/**
 * AuthProvider Component
 * Manages authentication state and provides auth functions to the entire app
 * @param {Object} children - Child components that need access to auth state
 */
export function AuthProvider({ children }) {
  // State to store current user information (null if not logged in)
  const [user, setUser] = useState(null)
  
  // Loading state to show spinner while checking for existing session
  const [isLoading, setIsLoading] = useState(true)

  /**
   * useEffect Hook - Runs once when component mounts
   * Checks if user was previously logged in by reading from cookie
   * This restores the user session on page refresh
   */
  useEffect(() => {
    // Check cookie for existing session (set during login)
    const cookieUser = document.cookie
      .split('; ')
      .find(row => row.startsWith('user='))
      ?.split('=')[1]
    
    if (cookieUser) {
      try {
        setUser(JSON.parse(decodeURIComponent(cookieUser)))
      } catch (error) {
        console.error("Error parsing user cookie:", error)
      }
    }
    setIsLoading(false) // Done checking, stop loading
  }, [])

  /**
   * Login Function
   * Authenticates user by checking credentials from JSON file via API
   * @param {Object} credentials - Login credentials (email/loginId and password)
   * @returns {Promise} Resolves if login successful, rejects with error message
   */
  const login = async (credentials) => {
    try {
      const url = `${window.location.origin}/api/auth`
      console.log("Calling auth API at:", url)
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          email: credentials.email,
          loginId: credentials.loginId,
          password: credentials.password,
        }),
      })
      
      console.log("Auth API response status:", response.status)
      console.log("Auth API response URL:", response.url)

      // Check if response is OK
      if (!response.ok) {
        console.error("Auth API response not OK:", response.status, response.statusText)
        throw new Error(`Server error: ${response.status}`)
      }

      // Check content type
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("Response is not JSON:", contentType, text.substring(0, 200))
        throw new Error("Invalid response from server")
      }

      const data = await response.json()

      if (data.success) {
        setUser(data.user) // Update React state
        // Set cookie for server-side authentication (used by middleware)
        document.cookie = `user=${encodeURIComponent(JSON.stringify(data.user))}; path=/; max-age=86400` // 24 hours
        return data.user
      } else {
        throw new Error(data.message || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  /**
   * SignUp Function
   * Registers a new user/company and saves data to JSON file via API
   * @param {Object} userData - User registration data (loginId, name, email, etc.)
   * @returns {Promise} Resolves if signup successful, rejects with error message
   */
  const signup = async (userData) => {
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "signup",
          ...userData,
        }),
      })

      const data = await response.json()

      if (data.success) {
        console.log("User registered successfully:", userData.loginId)
        return data.user
      } else {
        throw new Error(data.message || "Signup failed")
      }
    } catch (error) {
      console.error("Signup error:", error)
      throw error
    }
  }

  /**
   * Logout Function
   * Clears user data from state and cookies
   */
  const logout = () => {
    setUser(null) // Clear React state
    // Clear the auth cookie by setting expiration date in the past
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
  }

  // Provide auth state and functions to all child components
  return <AuthContext.Provider value={{ user, isLoading, login, logout, signup }}>{children}</AuthContext.Provider>
}

/**
 * useAuth Custom Hook
 * Provides easy access to authentication context in any component
 * @returns {Object} { user, isLoading, login, logout }
 */
export function useAuth() {
  return useContext(AuthContext)
}
