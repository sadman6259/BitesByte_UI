"use client";
import React, { useState, useRef, useEffect, JSX } from "react";
import { Chart, registerables, ChartOptions } from "chart.js";
import {
  Scale,
  Gauge,
  Trophy,
  Utensils,
  Apple,
  Target,
  Carrot,
  Dumbbell,
  Droplet,
  Moon,
  HeartPulse,
  Activity,
} from "lucide-react";

Chart.register(...registerables);

type ChartType =
  | "bar"
  | "line"
  | "pie"
  | "doughnut"
  | "radar"
  | "polarArea"
  | "bubble";

interface ChartDataset {
  label?: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string;
  tension?: number;
  fill?: boolean;
  // Add other dataset properties as needed
}
interface ChartConfig {
  type: ChartType;
  data: {
    labels: string[];
    datasets: ChartDataset[];
  };
  options?: ChartOptions;
}

interface DashboardItem {
  title: string;
  items: string[];
  chart: ChartConfig;
  icon: JSX.Element;
  bgColor: string;
  hoverBgColor: string;
  iconColor: string;
}

const dashboardData: DashboardItem[] = [
  // 1. Body Composition
  {
    title: "Body Composition",
    items: [
      "Current Weight: 75kg",
      "Goal Weight: 68kg",
      "BMI: 24.2",
      "Body Fat: 22%",
      "Muscle Mass: 38%",
      "Water %: 55%",
    ],
    chart: {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Weight (kg)",
            data: [78, 76, 75, 74, 75, 74],
            borderColor: "#ff8f15",
            backgroundColor: "rgba(255, 143, 21, 0.1)",
            tension: 0.3,
            fill: true,
          },
        ],
      },
    },
    icon: <Scale className="w-8 h-8" />,
    bgColor: "bg-orange-50",
    hoverBgColor: "hover:bg-orange-500",
    iconColor: "text-orange-500",
  },

  // 2. Body Fat Chart
  {
    title: "Body Fat Chart",
    items: [
      "Start: 25% (Jan)",
      "Current: 22%",
      "Goal: 18%",
      "Trend: -0.8%/month",
    ],
    chart: {
      type: "bar",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr"],
        datasets: [
          {
            label: "Body Fat %",
            data: [25, 23, 22, 21],
            backgroundColor: "#686868",
          },
        ],
      },
    },
    icon: <Gauge className="w-8 h-8" />,
    bgColor: "bg-gray-50",
    hoverBgColor: "hover:bg-gray-600",
    iconColor: "text-gray-500",
  },

  // 3. Weight Loss Challenge
  {
    title: "Weight Loss Challenge",
    items: [
      "Target Loss: 7kg",
      "Lost So Far: 3kg",
      "Days Completed: 90/180",
      "Next Milestone: 73kg",
    ],
    chart: {
      type: "radar",
      data: {
        labels: ["Weight", "Body Fat", "Muscle", "Hydration"],
        datasets: [
          {
            label: "Current",
            data: [75, 22, 38, 55],
            backgroundColor: "rgba(255, 143, 21, 0.2)",
          },
        ],
      },
    },
    icon: <Trophy className="w-8 h-8" />,
    bgColor: "bg-amber-50",
    hoverBgColor: "hover:bg-amber-500",
    iconColor: "text-amber-500",
  },

  // 4. Calorie Chart
  {
    title: "Calorie Chart",
    items: [
      "Basal: 1800 kcal",
      "Maintenance: 2200 kcal",
      "Deficit Target: 1700 kcal",
      "Today's Intake: 1850 kcal",
    ],
    chart: {
      type: "doughnut",
      data: {
        labels: ["Protein", "Carbs", "Fats"],
        datasets: [
          {
            data: [120, 180, 70],
            backgroundColor: ["#ff8f15", "#32b266", "#686868"],
          },
        ],
      },
    },
    icon: <Utensils className="w-8 h-8" />,
    bgColor: "bg-red-50",
    hoverBgColor: "hover:bg-red-500",
    iconColor: "text-red-500",
  },

  // 5. Food Caloric Value
  {
    title: "Food Caloric Value",
    items: [
      "Breakfast: 450 kcal",
      "Lunch: 650 kcal",
      "Dinner: 550 kcal",
      "Snacks: 200 kcal",
    ],
    chart: {
      type: "polarArea",
      data: {
        labels: ["Breakfast", "Lunch", "Dinner", "Snacks"],
        datasets: [
          {
            data: [450, 650, 550, 200],
            backgroundColor: [
              "rgba(255, 143, 21, 0.7)",
              "rgba(50, 178, 102, 0.7)",
              "rgba(104, 104, 104, 0.7)",
              "rgba(44, 62, 80, 0.7)",
            ],
          },
        ],
      },
    },
    icon: <Apple className="w-8 h-8" />,
    bgColor: "bg-green-50",
    hoverBgColor: "hover:bg-green-500",
    iconColor: "text-green-500",
  },

  // 6. Daily Target Calories
  {
    title: "Daily Target Calories",
    items: [
      "Target: 1700 kcal",
      "Consumed: 1350 kcal",
      "Remaining: 350 kcal",
      "Exercise Bonus: 200 kcal",
    ],
    chart: {
      type: "bar",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Consumed",
            data: [1650, 1700, 1550, 1800, 1600, 1900, 1750],
            backgroundColor: "#ff8f15",
          },
        ],
      },
    },
    icon: <Target className="w-8 h-8" />,
    bgColor: "bg-blue-50",
    hoverBgColor: "hover:bg-blue-500",
    iconColor: "text-blue-500",
  },

  // 7. Nutrient Analysis
  {
    title: "Nutrient Analysis",
    items: [
      "Protein: 120g (28%)",
      "Carbs: 180g (42%)",
      "Fats: 70g (30%)",
      "Fiber: 30g",
    ],
    chart: {
      type: "pie",
      data: {
        labels: ["Protein", "Carbs", "Fats", "Fiber"],
        datasets: [
          {
            data: [120, 180, 70, 30],
            backgroundColor: [
              "rgba(255, 143, 21, 0.7)",
              "rgba(50, 178, 102, 0.7)",
              "rgba(104, 104, 104, 0.7)",
              "rgba(44, 62, 80, 0.7)",
            ],
          },
        ],
      },
    },
    icon: <Carrot className="w-8 h-8" />,
    bgColor: "bg-purple-50",
    hoverBgColor: "hover:bg-purple-500",
    iconColor: "text-purple-500",
  },

  // 8. Exercise Log
  {
    title: "Virtual Guardian ",
    items: [
      "Today: 45min Cardio",
      "Calories Burnt: 350 kcal",
      "Weekly Total: 1200 kcal",
      "Monthly Goal: 5000 kcal",
    ],
    chart: {
      type: "line",
      data: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [
          {
            label: "Calories Burnt",
            data: [800, 950, 1100, 1200],
            borderColor: "#ff8f15",
            backgroundColor: "rgba(255, 143, 21, 0.1)",
            tension: 0.3,
            fill: true,
          },
        ],
      },
    },
    icon: <Dumbbell className="w-8 h-8" />,
    bgColor: "bg-yellow-50",
    hoverBgColor: "hover:bg-yellow-500",
    iconColor: "text-yellow-500",
  },

  // 9. Water Intake Log
  {
    title: "Water Intake Log",
    items: [
      "Today: 2.5L",
      "Daily Goal: 3L",
      "Weekly Avg: 2.8L",
      "Best Day: 3.5L",
    ],
    chart: {
      type: "bar",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Water (L)",
            data: [2.5, 3.0, 2.8, 2.7, 3.2, 2.5, 3.5],
            backgroundColor: "#3498db",
          },
        ],
      },
    },
    icon: <Droplet className="w-8 h-8" />,
    bgColor: "bg-cyan-50",
    hoverBgColor: "hover:bg-cyan-500",
    iconColor: "text-cyan-500",
  },

  // 10. Sleep Quality
  {
    title: "Food Intake Log",
    items: [
      "Last Night: 7.5h",
      "Deep Sleep: 2.1h",
      "Sleep Score: 82/100",
      "Weekly Avg: 7.2h",
    ],
    chart: {
      type: "line",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Hours",
            data: [7.2, 6.8, 7.5, 7.0, 8.1, 7.5, 7.0],
            borderColor: "#9b59b6",
            backgroundColor: "rgba(155, 89, 182, 0.1)",
            tension: 0.3,
            fill: true,
          },
        ],
      },
    },
    icon: <Moon className="w-8 h-8" />,
    bgColor: "bg-indigo-50",
    hoverBgColor: "hover:bg-indigo-500",
    iconColor: "text-indigo-500",
  },

  // 11. Heart Rate
  {
    title: "Exercise Log",
    items: [
      "Resting: 62 bpm",
      "Max: 185 bpm",
      "Avg Workout: 142 bpm",
      "Recovery: 28 bpm",
    ],
    chart: {
      type: "line",
      data: {
        labels: ["6AM", "12PM", "6PM", "12AM"],
        datasets: [
          {
            label: "BPM",
            data: [62, 72, 68, 60],
            borderColor: "#e74c3c",
            backgroundColor: "rgba(231, 76, 60, 0.1)",
            tension: 0.3,
            fill: true,
          },
        ],
      },
    },
    icon: <HeartPulse className="w-8 h-8" />,
    bgColor: "bg-pink-50",
    hoverBgColor: "hover:bg-pink-500",
    iconColor: "text-pink-500",
  },

  // 12. Workout Types
  {
    title: "Body Log",
    items: ["Cardio: 45%", "Strength: 30%", "Flexibility: 15%", "Other: 10%"],
    chart: {
      type: "doughnut",
      data: {
        labels: ["Cardio", "Strength", "Flexibility", "Other"],
        datasets: [
          {
            data: [45, 30, 15, 10],
            backgroundColor: ["#e74c3c", "#3498db", "#2ecc71", "#f39c12"],
          },
        ],
      },
    },
    icon: <Activity className="w-8 h-8" />,
    bgColor: "bg-teal-50",
    hoverBgColor: "hover:bg-teal-500",
    iconColor: "text-teal-500",
  },
];

export default function GoalDashboard() {
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (selectedSection !== null && chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        const section = dashboardData[selectedSection];
        chartInstance.current = new Chart(ctx, {
          type: section.chart.type,
          data: section.chart.data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "top" },
              tooltip: { mode: "index", intersect: false },
            },
            ...section.chart.options,
          },
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [selectedSection]);

  return (
    <div className=" bg-customBeige px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl text-customOrange font-bold mb-2">
          GOAL MANAGEMENT
        </h1>
        <h2 className="text-xl font-semibold text-customGreen">DASHBOARD</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-2">
        {dashboardData.map((section, index) => (
          <div
            key={index}
            className={`${section.bgColor} p-6  rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer flex flex-col
              ${section.hoverBgColor} hover:text-white group relative overflow-hidden`}
            onClick={() => setSelectedSection(index)}
          >
            {/* Large icon in the background */}
            <div
              className={`absolute -right-4 -bottom-4 opacity-10 ${section.iconColor}`}
            >
              {React.cloneElement(section.icon, { className: "w-24 h-24" })}
            </div>

            <div className="flex items-center gap-4 mb-4 z-10">
              <div
                className={`p-3 rounded-lg ${
                  section.iconColor
                } ${section.bgColor.replace("bg-", "bg-")}`}
              >
                {section.icon}
              </div>
              <h3
                className={`font-semibold text-lg text-gray-800 group-hover:text-white transition-colors`}
              >
                {section.title}
              </h3>
            </div>

            {/* <ul className="space-y-2 flex-grow z-10">
              {section.items.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className="text-sm text-gray-700 group-hover:text-white/90 transition-colors flex items-start"
                >
                  <span className="inline-block w-2 h-2 rounded-full bg-current mt-1.5 mr-2"></span>
                  {item}
                </li>
              ))}
            </ul> */}

            <div
              className={`mt-4 pt-3 border-t border-gray-200 group-hover:border-white/30 text-xs text-gray-500 font-medium 
                group-hover:text-white transition-colors flex items-center justify-between z-10`}
            >
              <span>View detailed chart</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedSection !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-4 rounded-xl ${dashboardData[selectedSection].bgColor} ${dashboardData[selectedSection].iconColor}`}
                  >
                    {React.cloneElement(dashboardData[selectedSection].icon, {
                      className: "w-10 h-10",
                    })}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {dashboardData[selectedSection].title}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Updated: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSection(null)}
                  className="text-gray-500 hover:text-black text-2xl p-1"
                >
                  ✕
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-700 border-b pb-2">
                    Key Metrics
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {dashboardData[selectedSection].items.map((item, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-start"
                      >
                        <span
                          className={`w-3 h-3 rounded-full mt-1 mr-3 ${dashboardData[
                            selectedSection
                          ].iconColor.replace("text-", "bg-")}`}
                        ></span>
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-700 border-b pb-2">
                    Progress Visualization
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-64 md:h-80">
                    <canvas ref={chartRef} className="w-full h-full" />
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    Hover over chart elements for detailed values
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
