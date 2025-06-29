"use client";

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateInput = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");

  // Set today's date + 2 days as the minimum
  const today = new Date();
  const minSelectableDate = new Date(today);
  minSelectableDate.setDate(today.getDate() + 2);

  const timeSlots = [
    { label: "Morning (9 AM - 11 AM)", value: "morning" },
    { label: "Afternoon (2 PM - 4 PM)", value: "afternoon" },
    { label: "Night (7 PM - 9 PM)", value: "night" },
  ];

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div>
        <label className="block text-xs font-bold mb-1 uppercase">
          Preferred Delivery Date *
        </label>
        <DatePicker
          selected={selectedDate}
          onChange={(date: Date | null) => setSelectedDate(date)}
          minDate={minSelectableDate}
          dateFormat="EEE MMM dd yyyy" // Example: Thu Jun 19 2025
          placeholderText="Click to select a date"
          className="w-full px-4 py-2 border border-customOrange rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:outline"
        />
      </div>

      <div>
        <label className="block text-xs font-bold mb-1 uppercase">
          Preferred Delivery Time *
        </label>
        <select
          value={selectedTimeSlot}
          onChange={(e) => setSelectedTimeSlot(e.target.value)}
          className="w-full px-4 py-2 border border-customOrange rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="" disabled>
            Choose a time slot
          </option>
          {timeSlots.map((slot) => (
            <option key={slot.value} value={slot.value}>
              {slot.label}
            </option>
          ))}
        </select>
      </div>

      {selectedDate && selectedTimeSlot && (
        <div className="p-4 bg-orange-50 rounded-lg border text-orange-800 font-medium">
          Selected: {selectedDate.toDateString()} —{" "}
          {timeSlots.find((slot) => slot.value === selectedTimeSlot)?.label}
        </div>
      )}
    </div>
  );
};

export default DateInput;
