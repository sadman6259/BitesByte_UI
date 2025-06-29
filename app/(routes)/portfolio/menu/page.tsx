"use client";

import SimpleMenuListBox from "@/app/components/SimpleMenuListBox";
import SuggestionMenuListForCustom from "@/app/components/SuggestionMenuListForCustom";
import AddToCartModal from "@/app/components/AddToCartModal";
import { useAtom } from "jotai";
import { cartAtom } from "@/app/store/menuQuantityStore";
import { useState, useEffect } from "react";
import { Edit2, Save, X, AlertTriangle } from "lucide-react";
import { Chart, registerables } from "chart.js";
import { Doughnut } from "react-chartjs-2";

// Register Chart.js components
Chart.register(...registerables);

const Menu = () => {
  const [desiredCalories, setDesiredCalories] = useState<number>(2400);
  const [selectedCalories, setSelectedCalories] = useState<number>(0);
  const [remainingCalories, setRemainingCalories] = useState<number>(0);
  const [showAddToCartModal, setShowAddToCartModal] = useState<boolean>(false);
  const [cart, setCart] = useAtom(cartAtom);
  const [desiredCaloriesMenu, setDesiredCaloriesMenu] = useState<any[]>([]);
  const [getStandardMenus, setStandardMenus] = useState<any[]>([]);
  const [caloriesError, setCaloriesError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [nutrients, setNutrients] = useState({
    protein: { current: 0, target: 0 },
    carbs: { current: 0, target: 0 },
    fat: { current: 0, target: 0 },
  });
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [tempTarget, setTempTarget] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendationError, setRecommendationError] = useState<string | null>(
    null
  );

  const formatNumber = (num: number) => {
    return num % 1 === 0 ? num.toString() : num.toFixed(1);
  };

  // Calculate totals from cart
  useEffect(() => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    cart.forEach((item) => {
      const quantity = item.quantity;
      const menu = item.menu;
      totalCalories += quantity * (menu.totalCalories || 0);
      totalProtein += quantity * (menu.protein || 0);
      totalCarbs += quantity * (menu.carbs || 0);
      totalFat += quantity * (menu.fat || 0);
    });

    const roundedCalories = Math.round(totalCalories * 10) / 10;
    const roundedProtein = Math.round(totalProtein * 10) / 10;
    const roundedCarbs = Math.round(totalCarbs * 10) / 10;
    const roundedFat = Math.round(totalFat * 10) / 10;

    setSelectedCalories(roundedCalories);
    setRemainingCalories(
      Math.round((desiredCalories - roundedCalories) * 10) / 10
    );

    // Calculate nutrient targets
    const proteinTarget = Math.round((desiredCalories * 0.3) / 4);
    const carbsTarget = Math.round((desiredCalories * 0.5) / 4);
    const fatTarget = Math.round((desiredCalories * 0.2) / 9);

    setNutrients({
      protein: { current: roundedProtein, target: proteinTarget },
      carbs: { current: roundedCarbs, target: carbsTarget },
      fat: { current: roundedFat, target: fatTarget },
    });
  }, [cart, desiredCalories]);

  // Fetch standard menus
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BITESBYTE_API_URL}/getavailablemenus`, {
      method: "GET",
      headers: { Accept: "application/json" },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setStandardMenus(
          data.filter((item: any) => item.category === "standard")
        );
      })
      .catch((error) => {
        console.error("Error fetching menus:", error);
        setRecommendationError(
          "Failed to load menu data. Please try again later."
        );
      });
  }, []);

  // Fetch recommended menus when desired calories is set
  const fetchRecommendedMeals = async () => {
    if (!desiredCalories || desiredCalories < 250 || desiredCalories > 10000) {
      setRecommendationError(
        "Please set a valid calorie target between 250-10000"
      );
      return;
    }

    setIsLoading(true);
    setRecommendationError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BITESBYTE_API_URL}/getRecommendedMenuByCalorie`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(desiredCalories),

          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Server responded with status ${response.status}`
        );
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("Invalid data format received from server");
      }

      setDesiredCaloriesMenu(data);
    } catch (error: any) {
      console.error("Error fetching recommended meals:", error);
      let errorMessage = "Failed to load recommended meals.";

      if (error.name === "AbortError") {
        errorMessage = "Request timed out. Please try again.";
      } else if (error.message.includes("400")) {
        errorMessage = "Invalid request. Please check your calorie target.";
      } else if (error.message.includes("Failed to fetch")) {
        errorMessage =
          "Could not connect to the server. Please check your connection.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setRecommendationError(errorMessage);
      setDesiredCaloriesMenu([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch when component mounts or desiredCalories changes
  useEffect(() => {
    fetchRecommendedMeals();
  }, [desiredCalories]);

  const onSubmitCalories = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (desiredCalories < 250 || desiredCalories > 10000) {
      setCaloriesError("Please enter a value between 250 and 10000 calories.");
      return;
    }
    fetchRecommendedMeals();
  };

  const handleEditTarget = () => {
    setTempTarget(desiredCalories.toString());
    setIsEditingTarget(true);
  };

  const handleSaveTarget = () => {
    const newTarget = parseInt(tempTarget);
    if (isNaN(newTarget) || newTarget < 250 || newTarget > 10000) {
      setCaloriesError("Please enter a value between 250 and 10000 calories.");
      return;
    }
    setCaloriesError(null);
    setDesiredCalories(newTarget);
    setIsEditingTarget(false);
  };

  const handleCancelEdit = () => {
    setIsEditingTarget(false);
    setCaloriesError(null);
  };

  // Mobile detection
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const NutrientAnalysis = () => {
    // Check if all nutrient values are zero or empty
    const isEmptyData =
      nutrients.protein.current === 0 &&
      nutrients.carbs.current === 0 &&
      nutrients.fat.current === 0;

    // Prepare data for the chart
    const chartData = {
      labels: ["Protein", "Carbs", "Fat"],
      datasets: [
        {
          data: isEmptyData
            ? [1, 1, 1] // Equal values to show full circle when empty
            : [
                nutrients.protein.current,
                nutrients.carbs.current,
                nutrients.fat.current,
              ],
          backgroundColor: isEmptyData
            ? ["#CCCCCC", "#CCCCCC", "#CCCCCC"] // All grey when empty
            : [
                "#FF6384", // Protein - pink
                "#36A2EB", // Carbs - blue
                "#FFCE56", // Fat - yellow
              ],
          borderWidth: 0,
          type: "doughnut" as const,
        },
      ],
    };

    const chartOptions = {
      cutout: "70%",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom" as const,
          display: !isEmptyData, // Hide legend when data is empty
        },
        tooltip: {
          enabled: !isEmptyData, // Disable tooltips when data is empty
          callbacks: {
            label: function (context: any) {
              const label = context.label || "";
              const value = context.raw || 0;
              return `${label}: ${value}g (current)`;
            },
          },
        },
      },
    };

    return (
      <div className="my-6">
        <h2 className="text-xl font-semibold mb-4 text-customGray">
          Nutrient Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Doughnut Chart */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-customGray/20">
            <div className="h-64 relative">
              <Doughnut data={chartData} options={chartOptions} />
            </div>
            <div className="text-center mt-2 text-sm text-customGray">
              {isEmptyData ? "No data available" : "Current vs Target Intake"}
            </div>
          </div>

          {/* Rest of your component remains the same */}
          {/* Nutrient Details */}
          <div className="space-y-4">
            {Object.entries(nutrients).map(([nutrient, values]) => (
              <div
                key={nutrient}
                className="bg-customBeige p-4 rounded-lg border border-customGray/20"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-customGray capitalize">
                    {nutrient}
                  </h3>
                  <div className="text-right">
                    <div className="text-xl font-bold text-customOrange">
                      {values.current}g
                    </div>
                    <div className="text-sm text-customGray/70">
                      Target: {values.target}g
                    </div>
                  </div>
                </div>
                <div className="w-full bg-customGray/20 rounded-full h-2 mt-2">
                  <div
                    className="h-2 rounded-full bg-customOrange"
                    style={{
                      width: `${Math.min(
                        100,
                        (values.current / values.target) * 100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const CalorieChart = () => {
    const difference = selectedCalories - desiredCalories;

    // Determine the color based on the difference
    let consumedColor;
    if (difference <= 0) {
      consumedColor = "#ff8f15"; // Orange when under or equal to target
    } else if (difference <= 50) {
      consumedColor = "#10B981"; // Green when within 50 over target
    } else {
      consumedColor = "#EF4444"; // Red when more than 50 over target
    }

    const chartData = {
      labels: ["Consumed", "Remaining"],
      datasets: [
        {
          data: [
            selectedCalories,
            Math.max(0, desiredCalories - selectedCalories),
          ],
          backgroundColor: [
            consumedColor,
            "#E5E7EB", // Gray for remaining
          ],
          borderWidth: 0,
        },
      ],
    };

    const chartOptions = {
      cutout: "75%",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context: any) {
              const label = context.label || "";
              const value = context.raw || 0;
              return `${label}: ${value} kcal`;
            },
          },
        },
      },
    };

    return (
      <div className="relative w-40 h-40 mx-auto">
        <Doughnut data={chartData} options={chartOptions} />

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl font-bold text-customGray">
            {formatNumber(selectedCalories)}
          </div>
          <div className="text-sm text-customGray/70">of {desiredCalories}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-customBeige   relative">
      {/* Calorie Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col items-center">
          {/* Header with editable target */}
          <div className="flex items-center mb-4">
            <h2 className="text-md font-bold text-customGray mr-2">
              Daily Target Calories:
            </h2>
            {isEditingTarget ? (
              <div className="flex items-center">
                <input
                  type="number"
                  className="border-2 border-customOrange text-customOrange w-24 p-1 rounded-lg text-center"
                  value={tempTarget}
                  onChange={(e) => setTempTarget(e.target.value)}
                  min="250"
                  max="10000"
                />
                <button
                  onClick={handleSaveTarget}
                  className="ml-2 bg-customGreen text-white px-2 py-1 rounded text-sm"
                >
                  <Save className="h-4 w-4 mr-1" />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="ml-2 bg-customGray text-white px-2 py-1 rounded text-sm opacity-50"
                >
                  <X className="h-4 w-4 mr-1" />
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                <span className="font-bold text-customGray">
                  {desiredCalories}
                </span>
                <button
                  onClick={handleEditTarget}
                  className="ml-2 text-customOrange hover:text-customOrange/80"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
          {caloriesError && (
            <p className="text-red-500 text-sm mb-2">{caloriesError}</p>
          )}

          {/* Circular Calorie Chart */}
          <CalorieChart />

          {/* Remaining Calories */}
          <div className="text-customGray mt-4 text-center">
            <div className="font-medium mb-1">
              {remainingCalories < 0 ? "Sub Lost" : "Remaining Calories"}
            </div>
            <div
              className={
                remainingCalories < 0 ? "text-red-500 font-bold" : "font-bold"
              }
            >
              {formatNumber(remainingCalories)} kcal
            </div>
            {remainingCalories < 0 && (
              <div className="flex items-center justify-center text-red-500 text-sm mt-2 font-medium">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Exceeded by {formatNumber(Math.abs(remainingCalories))} kcal
              </div>
            )}
          </div>
        </div>

        {/* Nutrient Analysis */}
        <NutrientAnalysis />
      </div>

      {/* Recommended Meals */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-customGray">
          Recommended meals
        </h2>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-customOrange"></div>
            </div>
            <p className="text-customGray mt-2">Loading recommendations...</p>
          </div>
        ) : recommendationError ? (
          <div className="text-center py-8">
            <div className="text-red-500 mb-4 p-3 bg-red-50 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mx-auto mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {recommendationError}
            </div>
            <button
              onClick={fetchRecommendedMeals}
              className="bg-customOrange text-white px-4 py-2 rounded mt-2 hover:bg-customOrange/90 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : desiredCaloriesMenu.length > 0 ? (
          <SuggestionMenuListForCustom
            items={desiredCaloriesMenu}
            setShowAddToCart={setShowAddToCartModal}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-customGray/70">
              {desiredCalories
                ? "No recommendations found for your target calories"
                : "Set your calorie target to see recommendations"}
            </p>
          </div>
        )}
      </div>

      {/* Today's Menu */}
      <div className="bg-white rounded-lg shadow-md p-6 relative">
        <h2 className="text-xl font-semibold  text-customGray">Today's Menu</h2>

        <SimpleMenuListBox
          items={getStandardMenus}
          row={isMobile ? 1 : 3}
          col={isMobile ? 1 : 3}
          setShowAddToCart={setShowAddToCartModal}
        />
      </div>

      {/* Initial Calorie Input Form */}
      {!desiredCalories && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <form
            onSubmit={onSubmitCalories}
            className="bg-white p-6 rounded-lg max-w-md w-full"
          >
            <h2 className="text-xl font-semibold mb-4 text-customGray">
              Set Daily Target Calories
            </h2>
            <div className="mb-4">
              <input
                type="number"
                className="border-2 border-customOrange w-full p-2 rounded-lg"
                placeholder="Enter desired calories (250-10000)"
                onChange={(e) => setDesiredCalories(Number(e.target.value))}
                min="250"
                max="10000"
              />
              {caloriesError && (
                <p className="text-xs text-red-500 mt-1">
                  Please enter a value between 250 and 10000 calories.
                </p>
              )}
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-customGreen text-white px-4 py-2 rounded hover:bg-customGreen/90 transition-colors"
              >
                Set Target
              </button>
            </div>
          </form>
        </div>
      )}

      {showAddToCartModal && (
        <AddToCartModal setAddToCartModal={setShowAddToCartModal} />
      )}
    </div>
  );
};

export default Menu;
