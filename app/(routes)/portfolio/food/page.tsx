"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Utensils,
  Flame,
  MessageSquare,
  Calendar,
  Star,
} from "lucide-react";

type MealItem = {
  menuName: string;
  calorie: number;
};

type Order = {
  meals: string[];
  totalCalories: number;
};

type MonthData = {
  name: string;
  year: number;
  startDay: number;
  daysInMonth: number;
  orders: Record<number, Order>;
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Create an Axios instance with base configuration
const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BITESBYTE_API_URL}`, // Adjust this to your API base URL
  timeout: 5000,
});

const FoodOrderHistory = () => {
  const [currentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState<number>(
    currentDate.getMonth()
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    currentDate.getFullYear()
  );
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [monthData, setMonthData] = useState<MonthData | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  // Get the 3 months to display (previous 2 and current)
  const getDisplayMonths = () => {
    const months = [];
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    for (let i = 2; i >= 0; i--) {
      let month = currentMonth - i;
      let year = currentYear;

      if (month < 0) {
        month += 12;
        year -= 1;
      }

      months.push({
        month,
        year,
        name: monthNames[month],
        isCurrent: month === currentMonth,
      });
    }

    return months;
  };

  const displayMonths = getDisplayMonths();

  // Fetch user ID from localStorage using Axios
  useEffect(() => {
    const fetchUserId = async () => {
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) return;

      try {
        const response = await api.get(`/getuserbyemail`, {
          params: { email: userEmail },
        });
        setUserId(response.data.id);
      } catch (error) {
        console.error("Failed to fetch user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  // Function to get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Function to get start day of month (0-6 where 0 is Sunday)
  const getStartDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Fetch order dates for the current month/year using Axios
  const fetchOrderDates = async (month: number, year: number) => {
    if (!userId) return;

    setLoading(true);
    try {
      const monthYear = `${monthNames[month].toLowerCase()} ${year}`;

      // First request to get order dates
      const datesResponse = await api.get(
        `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/getorderdatesbymonthyear`,
        {
          params: {
            monthYear,
            userId,
          },
        }
      );
      const dates = datesResponse.data;

      // Create month data structure
      const daysInMonth = getDaysInMonth(year, month);
      const startDay = getStartDayOfMonth(year, month);

      // Initialize with empty orders
      const orders: Record<number, Order> = {};

      // Fetch details for each order date
      for (const dateStr of dates) {
        const date = new Date(dateStr);
        const day = date.getDate();

        // Second request to get order details
        const detailsResponse = await api.get(
          `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/getorderdetailsbycreateddate`,
          {
            params: {
              createdDate: dateStr,
              userId,
            },
          }
        );
        const mealItems: MealItem[] = detailsResponse.data;

        const meals = mealItems.map((item) => item.menuName);
        const totalCalories = mealItems.reduce(
          (sum, item) => sum + item.calorie,
          0
        );

        orders[day] = { meals, totalCalories };
      }

      setMonthData({
        name: monthNames[month],
        year,
        startDay,
        daysInMonth,
        orders,
      });
    } catch (error) {
      console.error("Error fetching order data:", error);
      // Fallback to empty month data if API fails
      const daysInMonth = getDaysInMonth(year, month);
      const startDay = getStartDayOfMonth(year, month);
      setMonthData({
        name: monthNames[month],
        year,
        startDay,
        daysInMonth,
        orders: {},
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDates(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear, userId]);

  const handleMonthChange = (month: number, year: number) => {
    setIsAnimating(true);
    setSelectedMonth(month);
    setSelectedYear(year);
    setSelectedDay(null);
  };

  const renderDay = (day: number) => {
    if (!monthData) return null;

    const order = monthData.orders[day];
    return (
      <div
        key={day}
        className={`
          relative h-16 flex flex-col items-center justify-center cursor-pointer
          transition-all duration-200 ease-in-out group
          ${order ? "bg-emerald-50 hover:bg-emerald-100" : "hover:bg-gray-50"}
          ${selectedDay === day ? "ring-2 ring-orange-300" : ""}
          border border-gray-100
        `}
        onClick={() => setSelectedDay((prev) => (prev === day ? null : day))}
      >
        <span
          className={`
          text-sm
          ${order ? "font-medium text-emerald-600" : "text-gray-500"}
          ${selectedDay === day ? "scale-110 text-orange-500 font-bold" : ""}
          transition-transform duration-100
        `}
        >
          {day}
        </span>
        {order && (
          <div className="flex mt-1 gap-1">
            {order.meals.slice(0, 2).map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 rounded-full bg-emerald-400"
              ></div>
            ))}
            {order.meals.length > 2 && (
              <div className="w-1 h-1 rounded-full bg-emerald-300"></div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderCalendar = () => {
    if (!monthData) return null;

    const weeks = [];
    let day = 1 - monthData.startDay;

    for (let row = 0; row < 6; row++) {
      const week = [];
      for (let col = 0; col < 7; col++) {
        if (day > 0 && day <= monthData.daysInMonth) {
          week.push(renderDay(day));
        } else {
          week.push(
            <div
              key={`empty-${row}-${col}`}
              className="h-16 border border-gray-100 bg-gray-50/20"
            />
          );
        }
        day++;
      }
      weeks.push(
        <div key={row} className="grid grid-cols-7">
          {week}
        </div>
      );
    }

    return weeks;
  };

  if (!userId) {
    return (
      <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-sm">
        <div className="text-center py-8">
          <p className="text-gray-500">
            Please sign in to view your order history
          </p>
        </div>
      </div>
    );
  }

  if (loading || !monthData) {
    return (
      <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-sm flex justify-center items-center h-64">
        <div className="animate-pulse text-gray-500">Loading calendar...</div>
      </div>
    );
  }

  const selectedOrder = selectedDay ? monthData.orders[selectedDay] : null;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Utensils className="w-5 h-5 text-orange-500" />
          Food Order History
          {userId}
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>{currentDate.toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-hide w-full justify-center">
          {displayMonths.map(({ month, year, name, isCurrent }) => (
            <button
              key={`${month}-${year}`}
              onClick={() => handleMonthChange(month, year)}
              className={`
                px-4 py-2 rounded-full transition-all duration-200 whitespace-nowrap
                flex items-center gap-1 ${
                  selectedMonth === month && selectedYear === year
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
              `}
            >
              {isCurrent && <Star className="w-4 h-4 fill-current" />}
              {name} {year}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`transition-opacity duration-300 ${
          isAnimating ? "opacity-70" : "opacity-100"
        }`}
      >
        <h3 className="text-lg mb-4 font-medium text-gray-700 flex items-center gap-2">
          <span className="text-orange-500">{monthData.name}</span>
          <span className="text-gray-400">{monthData.year}</span>
        </h3>
        <div className="grid grid-cols-7 text-center font-medium mb-2 text-gray-500 text-xs">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {renderCalendar()}
        </div>
      </div>

      {selectedOrder && (
        <div className="mt-8 p-6 border border-gray-200 rounded-lg bg-orange-50 animate-fadeIn ">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-lg font-bold text-customGray flex items-center gap-2">
              <Utensils className="w-5 h-5 text-customOrange" />
              Order Details - {monthData.name} {selectedDay}, {monthData.year}
            </h4>
            <button
              onClick={() => setSelectedDay(null)}
              className="text-gray-400 hover:text-orange-500 transition-colors p-1 hover:bg-orange-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-xs">
              <p className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-1">
                <Flame className="w-4 h-4 text-orange-400" />
                Total Calories
              </p>
              <p className="text-2xl font-bold text-emerald-600">
                {selectedOrder.totalCalories.toFixed(1)} kcal
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-xs ">
              <p className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-1">
                <Utensils className="w-4 h-4 text-orange-400" />
                Meals Ordered
              </p>
              <ul className="space-y-2 h-16 overflow-y-auto">
                {selectedOrder.meals.map((meal, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                    <span className="text-gray-700">{meal}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodOrderHistory;
