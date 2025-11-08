import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const DATA_FILE = path.join(process.cwd(), "data", "users.json")

function ensureDataFile() {
  const dataDir = path.join(process.cwd(), "data")
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ users: [], employees: [] }, null, 2))
  }
}

/**
 * GET - Retrieve all employees or a specific employee
 */
export async function GET(request) {
  try {
    ensureDataFile()
    
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get("id")
    const companyId = searchParams.get("companyId")
    
    const fileData = fs.readFileSync(DATA_FILE, "utf8")
    const data = JSON.parse(fileData)
    
    if (!data.employees) {
      data.employees = []
    }
    
    // Get specific employee
    if (employeeId) {
      const employee = data.employees.find((e) => e.id === employeeId)
      if (employee) {
        return NextResponse.json({ success: true, employee })
      } else {
        return NextResponse.json({ success: false, message: "Employee not found" }, { status: 404 })
      }
    }
    
    // Get employees by company
    let employees = data.employees
    if (companyId) {
      employees = employees.filter((e) => e.companyId === companyId)
    }
    
    return NextResponse.json({ success: true, employees })
  } catch (error) {
    console.error("Error reading employees:", error)
    return NextResponse.json({ success: false, message: "Failed to read employees" }, { status: 500 })
  }
}

/**
 * POST - Create a new employee or update attendance (check-in/check-out)
 */
export async function POST(request) {
  try {
    ensureDataFile()
    
    const body = await request.json()
    const { action, ...employeeData } = body
    
    const fileData = fs.readFileSync(DATA_FILE, "utf8")
    const data = JSON.parse(fileData)
    
    if (!data.employees) {
      data.employees = []
    }
    
    if (action === "check-in") {
      const employee = data.employees.find((e) => e.id === employeeData.id)
      if (employee) {
        employee.checkInTime = employeeData.checkInTime
        employee.status = "present"
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
        return NextResponse.json({ success: true, message: "Checked in successfully", employee })
      }
      return NextResponse.json({ success: false, message: "Employee not found" }, { status: 404 })
    }
    
    if (action === "check-out") {
      const employee = data.employees.find((e) => e.id === employeeData.id)
      if (employee) {
        employee.checkOutTime = employeeData.checkOutTime
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
        return NextResponse.json({ success: true, message: "Checked out successfully", employee })
      }
      return NextResponse.json({ success: false, message: "Employee not found" }, { status: 404 })
    }
    
    // Create new employee
    const existingEmployee = data.employees.find((e) => e.email === employeeData.email)
    if (existingEmployee) {
      return NextResponse.json(
        { success: false, message: "Employee already exists" },
        { status: 400 }
      )
    }
    
    data.employees.push(employeeData)
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
    
    return NextResponse.json({
      success: true,
      message: "Employee created successfully",
      employee: employeeData,
    })
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

/**
 * PUT - Update employee information
 */
export async function PUT(request) {
  try {
    ensureDataFile()
    
    const body = await request.json()
    const { id, ...updates } = body
    
    const fileData = fs.readFileSync(DATA_FILE, "utf8")
    const data = JSON.parse(fileData)
    
    if (!data.employees) {
      data.employees = []
    }
    
    const employeeIndex = data.employees.findIndex((e) => e.id === id)
    
    if (employeeIndex === -1) {
      return NextResponse.json({ success: false, message: "Employee not found" }, { status: 404 })
    }
    
    data.employees[employeeIndex] = { ...data.employees[employeeIndex], ...updates }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
    
    return NextResponse.json({
      success: true,
      message: "Employee updated successfully",
      employee: data.employees[employeeIndex],
    })
  } catch (error) {
    console.error("Error updating employee:", error)
    return NextResponse.json({ success: false, message: "Failed to update employee" }, { status: 500 })
  }
}
