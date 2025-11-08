"use client"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { DataTable } from "@/components/data-table"
import { attendanceRecords } from "@/lib/mock-data"
import { motion } from "framer-motion"
import { useState } from "react"

/**
 * Attendance Page Component
 * Displays employee attendance records in a table format
 * Allows marking attendance with a button
 */
export default function Attendance() {
  // State to store attendance records (initialized with mock data)
  const [records, setRecords] = useState(attendanceRecords)
  
  // State to toggle the "attendance marked" message
  const [markingAttendance, setMarkingAttendance] = useState(false)

  // Table column headers
  const headers = ["Name", "Date", "Status", "Check-In", "Check-Out"]
  
  /**
   * Map attendance records to table rows
   * Each record becomes an array of values for the table
   */
  const rows = records.map((record) => [
    record.employeeName, // Employee name
    record.date, // Attendance date
    // Status badge with color coding (green for Present, red for Absent)
    <span
      key={record.id}
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        record.status === "Present" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
      }`}
    >
      {record.status}
    </span>,
    record.checkIn || "-", // Check-in time (or "-" if not available)
    record.checkOut || "-", // Check-out time (or "-" if not available)
  ])

  /**
   * handleMarkAttendance Function
   * Toggles the attendance marking message (demo functionality)
   */
  const handleMarkAttendance = () => {
    setMarkingAttendance(!markingAttendance)
  }

  return (
    <LayoutWrapper>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Attendance</h1>
            <p className="text-muted-foreground">Track employee attendance</p>
          </div>
          <button
            onClick={handleMarkAttendance}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            {markingAttendance ? "Done" : "Mark Attendance"}
          </button>
        </div>

        {markingAttendance && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <p className="text-blue-700">Attendance marked for today.</p>
          </motion.div>
        )}

        <DataTable headers={headers} rows={rows} />
      </motion.div>
    </LayoutWrapper>
  )
}
