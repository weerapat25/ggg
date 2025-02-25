"use client"

import type React from "react"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

const rooms = {
  "ห้องประชุม 1": 100,
  "ห้องประชุม 2": 100,
  "ห้องประชุม 3": 100,
  "ห้องประชุม 4": 100,
  "ห้องประชุม 5": 50,
  "ห้องประชุม 6": 50,
  "ห้องประชุม 7": 50,
  "ห้องประชุม 8": 50,
}

// เพิ่มฟังก์ชันสำหรับสร้างตัวเลือกเวลา
function generateTimeOptions() {
  const options = []
  for (let hour = 8; hour < 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
      options.push(time)
    }
  }
  return options
}

const timeOptions = generateTimeOptions()

export default function RoomBookingForm() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [department, setDepartment] = useState("")
  const [attendees, setAttendees] = useState("")
  const [selectedRoom, setSelectedRoom] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  // ในฟังก์ชัน RoomBookingForm เพิ่ม state สำหรับเวลาเริ่มต้นและสิ้นสุด
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)

  // แก้ไขฟังก์ชัน validateTime
  const validateTime = () => {
    if (!startTime || !endTime) {
      setErrorMessage("กรุณาเลือกเวลาเริ่มต้นและเวลาสิ้นสุด")
      return false
    }
    if (startTime >= endTime) {
      setErrorMessage("เวลาเริ่มต้นต้องน้อยกว่าเวลาสิ้นสุด")
      return false
    }
    return true
  }

  // แก้ไขฟังก์ชัน handleSubmit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    if (!selectedRoom || !date || !department || !attendees || !startTime || !endTime) {
      setErrorMessage("กรุณากรอกข้อมูลให้ครบทุกช่อง")
      return
    }

    const attendeesNumber = Number.parseInt(attendees, 10)
    if (isNaN(attendeesNumber) || attendeesNumber <= 0) {
      setErrorMessage("กรุณากรอกจำนวนผู้เข้าประชุมให้ถูกต้อง")
      return
    }

    if (attendeesNumber > rooms[selectedRoom as keyof typeof rooms]) {
      setErrorMessage(`จำนวนผู้เข้าร่วมประชุมเกินความจุของห้อง (${rooms[selectedRoom as keyof typeof rooms]} คน)`)
      return
    }

    if (!validateTime()) {
      return
    }

    setShowConfirmation(true)
  }

  const handleConfirmBooking = () => {
    // ตรงนี้คุณสามารถเพิ่มโลจิกสำหรับการส่งข้อมูลการจองไปยังเซิร์ฟเวอร์
    console.log({ date, department, attendees, selectedRoom, startTime, endTime })
    setShowConfirmation(false)
    // เพิ่มโค้ดสำหรับรีเซ็ตฟอร์มหรือแสดงข้อความยืนยันการจองสำเร็จ
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="room">เลือกห้องประชุม</Label>
          <Select onValueChange={setSelectedRoom} value={selectedRoom} required>
            <SelectTrigger id="room">
              <SelectValue placeholder="เลือกห้องประชุม" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(rooms).map(([room, capacity]) => (
                <SelectItem key={room} value={room}>
                  {room} (รองรับ {capacity} คน)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="date">เลือกวันที่</Label>
          <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" required />
        </div>

        <div>
          <Label htmlFor="department">ส่วนงาน</Label>
          <Input
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="กรอกส่วนงานของคุณ"
            required
          />
        </div>

        <div>
          <Label htmlFor="attendees">จำนวนผู้เข้าประชุม</Label>
          <Input
            id="attendees"
            type="number"
            value={attendees}
            onChange={(e) => setAttendees(e.target.value)}
            placeholder="กรอกจำนวนผู้เข้าประชุม"
            required
            min="1"
          />
        </div>

        {/* เพิ่ม UI สำหรับเลือกเวลาในฟอร์ม (ใส่หลังจาก input จำนวนผู้เข้าประชุม) */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <Label htmlFor="startTime">เวลาเริ่มต้น</Label>
            <Select onValueChange={setStartTime} value={startTime} required>
              <SelectTrigger id="startTime">
                <SelectValue placeholder="เลือกเวลาเริ่มต้น" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Label htmlFor="endTime">เวลาสิ้นสุด</Label>
            <Select onValueChange={setEndTime} value={endTime} required>
              <SelectTrigger id="endTime">
                <SelectValue placeholder="เลือกเวลาสิ้นสุด" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}

        <Button type="submit">จองห้องประชุม</Button>
      </form>
      <Dialog open={showConfirmation} onOpenChange={(open: boolean) => setShowConfirmation(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ยืนยันการจองห้องประชุม</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              <strong>ห้องประชุม:</strong> {selectedRoom}
            </p>
            <p>
              <strong>วันที่:</strong> {date?.toLocaleDateString()}
            </p>
            <p>
              <strong>เวลา:</strong> {startTime} - {endTime}
            </p>
            <p>
              <strong>ส่วนงาน:</strong> {department}
            </p>
            <p>
              <strong>จำนวนผู้เข้าประชุม:</strong> {attendees}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              ยกเลิก
            </Button>
            <Button onClick={handleConfirmBooking}>ยืนยันการจอง</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

