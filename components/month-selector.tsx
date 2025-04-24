"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function MonthSelector({ onChange, initialDate = new Date() }) {
  const [currentDate, setCurrentDate] = useState(initialDate)
  const [availableYears, setAvailableYears] = useState([])

  // Generate a list of years (current year and 2 years back)
  useEffect(() => {
    const currentYear = new Date().getFullYear()
    setAvailableYears([currentYear - 2, currentYear - 1, currentYear, currentYear + 1])
  }, [])

  const handlePreviousMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() - 1)
    setCurrentDate(newDate)
    onChange(newDate)
  }

  const handleNextMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + 1)
    setCurrentDate(newDate)
    onChange(newDate)
  }

  const handleMonthChange = (month) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(Number.parseInt(month) - 1)
    setCurrentDate(newDate)
    onChange(newDate)
  }

  const handleYearChange = (year) => {
    const newDate = new Date(currentDate)
    newDate.setFullYear(Number.parseInt(year))
    setCurrentDate(newDate)
    onChange(newDate)
  }

  const formatMonth = (date) => {
    return `Tháng ${date.getMonth() + 1}/${date.getFullYear()}`
  }

  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-2">
        <Select value={(currentDate.getMonth() + 1).toString()} onValueChange={handleMonthChange}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Tháng" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <SelectItem key={month} value={month.toString()}>
                Tháng {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={currentDate.getFullYear().toString()} onValueChange={handleYearChange}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Năm" />
          </SelectTrigger>
          <SelectContent>
            {availableYears.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" size="icon" onClick={handleNextMonth}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
