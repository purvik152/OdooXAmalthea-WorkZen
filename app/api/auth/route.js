import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Path to the JSON file where we'll store user data
const DATA_FILE = path.join(process.cwd(), "data", "users.json")

/**
 * Ensure the data directory and file exist
 */
function ensureDataFile() {
  const dataDir = path.join(process.cwd(), "data")
  
  // Create data directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  
  // Create users.json file if it doesn't exist
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ users: [] }, null, 2))
  }
}

/**
 * GET - Retrieve all users or a specific user
 */
export async function GET(request) {
  try {
    ensureDataFile()
    
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const loginId = searchParams.get("loginId")
    
    const fileData = fs.readFileSync(DATA_FILE, "utf8")
    const data = JSON.parse(fileData)
    
    // If querying for specific user
    if (email || loginId) {
      const user = data.users.find(
        (u) => u.email === email || u.loginId === loginId
      )
      
      if (user) {
        return NextResponse.json({ success: true, user })
      } else {
        return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
      }
    }
    
    // Return all users (excluding passwords)
    const safeUsers = data.users.map(({ password, ...user }) => user)
    return NextResponse.json({ success: true, users: safeUsers })
  } catch (error) {
    console.error("Error reading users:", error)
    return NextResponse.json({ success: false, message: "Failed to read users" }, { status: 500 })
  }
}

/**
 * POST - Create a new user (signup) or login
 */
export async function POST(request) {
  try {
    ensureDataFile()
    
    const body = await request.json()
    const { action, ...userData } = body
    
    const fileData = fs.readFileSync(DATA_FILE, "utf8")
    const data = JSON.parse(fileData)
    
    if (action === "signup") {
      // Check if user already exists
      const existingUser = data.users.find(
        (u) => u.email === userData.email || u.loginId === userData.loginId
      )
      
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: "User already exists" },
          { status: 400 }
        )
      }
      
      // Add new user
      data.users.push(userData)
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
      
      return NextResponse.json({
        success: true,
        message: "User registered successfully",
        user: { ...userData, password: undefined }, // Don't send password back
      })
    } else if (action === "login") {
      // Find user by email or loginId
      const user = data.users.find(
        (u) => (u.email === userData.email || u.loginId === userData.loginId) && u.password === userData.password
      )
      
      if (user) {
        return NextResponse.json({
          success: true,
          message: "Login successful",
          user: { ...user, password: undefined }, // Don't send password back
        })
      } else {
        return NextResponse.json(
          { success: false, message: "Invalid credentials" },
          { status: 401 }
        )
      }
    }
    
    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

/**
 * PUT - Update user information
 */
export async function PUT(request) {
  try {
    ensureDataFile()
    
    const body = await request.json()
    const { loginId, ...updates } = body
    
    const fileData = fs.readFileSync(DATA_FILE, "utf8")
    const data = JSON.parse(fileData)
    
    const userIndex = data.users.findIndex((u) => u.loginId === loginId)
    
    if (userIndex === -1) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }
    
    // Update user data
    data.users[userIndex] = { ...data.users[userIndex], ...updates }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
    
    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      user: { ...data.users[userIndex], password: undefined },
    })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ success: false, message: "Failed to update user" }, { status: 500 })
  }
}

/**
 * DELETE - Remove a user
 */
export async function DELETE(request) {
  try {
    ensureDataFile()
    
    const { searchParams } = new URL(request.url)
    const loginId = searchParams.get("loginId")
    
    if (!loginId) {
      return NextResponse.json({ success: false, message: "Login ID required" }, { status: 400 })
    }
    
    const fileData = fs.readFileSync(DATA_FILE, "utf8")
    const data = JSON.parse(fileData)
    
    const initialLength = data.users.length
    data.users = data.users.filter((u) => u.loginId !== loginId)
    
    if (data.users.length === initialLength) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
    
    return NextResponse.json({ success: true, message: "User deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ success: false, message: "Failed to delete user" }, { status: 500 })
  }
}
