"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/app/context/auth-context"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { motion } from "framer-motion"
import { User, Mail, Phone, Briefcase, Building2, Calendar, IdCard } from "lucide-react"

export default function Profile() {
  const { user } = useAuth()
  const [employeeData, setEmployeeData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch employee data based on user's email
    fetchEmployeeProfile()
  }, [user])

  const fetchEmployeeProfile = async () => {
    try {
      // For admin, show admin user info
      // For employees, fetch from employees API
      if (user?.role === "Admin") {
        setEmployeeData({
          id: user.loginId,
          name: user.name,
          email: user.email,
          phone: user.phone,
          companyName: user.companyName,
          role: user.role,
          avatar: user.avatar,
          createdAt: user.createdAt,
        })
      } else {
        // Fetch employee data
        const response = await fetch(`/api/employees?companyId=${user?.loginId || ""}`)
        const data = await response.json()
        if (data.success) {
          const employee = data.employees.find(emp => emp.email === user?.email)
          if (employee) {
            setEmployeeData(employee)
          }
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground">View your profile information (View-only mode)</p>
      </div>

      {/* Profile Card */}
      <div className="bg-card border border-border rounded-lg p-8">
        {/* Header with Avatar */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg"
            style={{ backgroundColor: employeeData?.avatarColor || "#8B5CF6" }}
          >
            {employeeData?.avatar || user?.avatar || "U"}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground">{employeeData?.name || user?.name}</h2>
            <p className="text-lg text-muted-foreground">{employeeData?.position || user?.role}</p>
            {employeeData?.department && (
              <p className="text-sm text-muted-foreground">{employeeData.department} Department</p>
            )}
          </div>
        </div>

        {/* Profile Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Employee/User ID */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
              <IdCard size={16} />
              {user?.role === "Admin" ? "Login ID" : "Employee ID"}
            </label>
            <div className="px-4 py-3 bg-muted rounded-lg">
              <p className="font-medium text-foreground">{employeeData?.id || user?.loginId}</p>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
              <User size={16} />
              Full Name
            </label>
            <div className="px-4 py-3 bg-muted rounded-lg">
              <p className="font-medium text-foreground">{employeeData?.name || user?.name}</p>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
              <Mail size={16} />
              Email Address
            </label>
            <div className="px-4 py-3 bg-muted rounded-lg">
              <p className="font-medium text-foreground">{employeeData?.email || user?.email}</p>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
              <Phone size={16} />
              Phone Number
            </label>
            <div className="px-4 py-3 bg-muted rounded-lg">
              <p className="font-medium text-foreground">{employeeData?.phone || user?.phone || "Not provided"}</p>
            </div>
          </div>

          {/* Department (for employees) */}
          {employeeData?.department && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                <Briefcase size={16} />
                Department
              </label>
              <div className="px-4 py-3 bg-muted rounded-lg">
                <p className="font-medium text-foreground">{employeeData.department}</p>
              </div>
            </div>
          )}

          {/* Position (for employees) */}
          {employeeData?.position && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                <Briefcase size={16} />
                Position
              </label>
              <div className="px-4 py-3 bg-muted rounded-lg">
                <p className="font-medium text-foreground">{employeeData.position}</p>
              </div>
            </div>
          )}

          {/* Company Name (for admin) */}
          {user?.role === "Admin" && user?.companyName && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                <Building2 size={16} />
                Company Name
              </label>
              <div className="px-4 py-3 bg-muted rounded-lg">
                <p className="font-medium text-foreground">{user.companyName}</p>
              </div>
            </div>
          )}

          {/* Role */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
              <User size={16} />
              Role
            </label>
            <div className="px-4 py-3 bg-muted rounded-lg">
              <p className="font-medium text-foreground">{employeeData?.role || user?.role}</p>
            </div>
          </div>

          {/* Join/Created Date */}
          {(employeeData?.createdAt || user?.createdAt) && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                <Calendar size={16} />
                {user?.role === "Admin" ? "Account Created" : "Join Date"}
              </label>
              <div className="px-4 py-3 bg-muted rounded-lg">
                <p className="font-medium text-foreground">
                  {new Date(employeeData?.createdAt || user?.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Note */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Note:</strong> This is a view-only profile. Contact your administrator to update your information.
          </p>
        </div>
      </div>
    </div>
  )
}
