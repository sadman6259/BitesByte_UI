"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import axios from "axios";
import {
  Scale,
  Ruler,
  Calendar,
  VenusAndMars,
  Target,
  Activity,
} from "lucide-react";

interface UserData {
  id: number;
  name: string;
  email: string;
  password: string;
  goalWeight: number;
  goalBodyFat: number;
  foodAllergies: boolean;
  avgExerciseDuration: number;
  height: number;
  gender: string;
  age: number;
  currentWeight: number;
  activity: string;
}

const BioData: React.FC = () => {
  const [form, setForm] = useState({
    weight: "",
    height: "",
    age: "",
    gender: "",
    goalWeight: "",
    goalBodyFat: "",
    exerciseDuration: "",
    activity: "",
  });

  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">("cm");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (!["age", "exerciseDuration"].includes(name) && Number(value) > 500)
      return;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert goalWeight to kg if in lbs
      const goalWeightInKg =
        weightUnit === "lb"
          ? parseFloat(form.goalWeight) / 2.20462
          : parseFloat(form.goalWeight);

      // Convert current weight to kg if needed (for API)
      const currentWeightInKg =
        weightUnit === "lb"
          ? parseFloat(form.weight) / 2.20462
          : parseFloat(form.weight);

      // Convert height to cm if needed (for API)
      const heightInCm =
        heightUnit === "ft"
          ? parseFloat(form.height) * 30.48
          : parseFloat(form.height);

      const updateData: Partial<UserData> = {
        goalWeight: goalWeightInKg,
        goalBodyFat: parseFloat(form.goalBodyFat),
        avgExerciseDuration: parseFloat(form.exerciseDuration),
        height: heightInCm,
        currentWeight: currentWeightInKg,
        activity: form.activity,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BITESBYTE_API_URL}/updateuser`,
        {
          id: user?.id,
          ...updateData,
          name: user?.name,
          email: user?.email,
          password: "", // You should handle password updates separately
          gender: form.gender,
          age: parseInt(form.age),
          foodAllergies: user?.foodAllergies || false,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Goals updated successfully!");
        setErrorMessage("");
        setTimeout(() => setSuccessMessage(""), 3000);

        // Type-safe state update
        setUser((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            ...updateData,
          };
        });
      } else {
        throw new Error("Failed to update goals");
      }
    } catch (error) {
      console.error("Error updating goals:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to update goals. Please try again."
      );
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleWeightUnit = () => {
    const newUnit = weightUnit === "kg" ? "lb" : "kg";

    if (form.weight) {
      const weight = parseFloat(form.weight);
      const convertedWeight =
        weightUnit === "kg"
          ? (weight * 2.20462).toFixed(1)
          : (weight / 2.20462).toFixed(1);
      setForm((prev) => ({ ...prev, weight: convertedWeight }));
    }

    if (form.goalWeight) {
      const goalWeight = parseFloat(form.goalWeight);
      const convertedGoalWeight =
        weightUnit === "kg"
          ? (goalWeight * 2.20462).toFixed(1)
          : (goalWeight / 2.20462).toFixed(1);
      setForm((prev) => ({ ...prev, goalWeight: convertedGoalWeight }));
    }

    setWeightUnit(newUnit);
  };

  const toggleHeightUnit = () => {
    const newUnit = heightUnit === "cm" ? "ft" : "cm";

    if (form.height) {
      const height = parseFloat(form.height);
      const converted =
        heightUnit === "cm"
          ? (height / 30.48).toFixed(2)
          : (height * 30.48).toFixed(0);
      setForm((prev) => ({ ...prev, height: converted }));
    }

    setHeightUnit(newUnit);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const email = localStorage.getItem("userEmail");
      if (!email) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `${
            process.env.NEXT_PUBLIC_BITESBYTE_API_URL
          }/getuserbyemail?email=${encodeURIComponent(email)}`
        );
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setErrorMessage(
          err instanceof Error ? err.message : "Failed to load user data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      const currentWeight =
        weightUnit === "lb"
          ? (user.currentWeight * 2.20462).toFixed(1)
          : user.currentWeight.toFixed(1);

      const goalWeight =
        weightUnit === "lb"
          ? (user.goalWeight * 2.20462).toFixed(1)
          : user.goalWeight.toFixed(1);

      const height =
        heightUnit === "ft"
          ? (user.height / 30.48).toFixed(2)
          : user.height.toFixed(0);

      setForm({
        weight: currentWeight,
        height,
        age: user.age.toString(),
        gender: user.gender,
        goalWeight,
        goalBodyFat: user.goalBodyFat.toString(),
        exerciseDuration: user.avgExerciseDuration.toString(),
        activity: user.activity,
      });
    }
  }, [user, weightUnit, heightUnit]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-customBeige">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-customGreen"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-customBeige">
        <p className="text-red-500 text-lg">User not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-customBeige p-6">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-customGreen">Bio Data</h2>
          <div className="w-16 h-1 bg-customGreen mx-auto mt-2"></div>
        </div>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
            {errorMessage}
          </div>
        )}

        <form className="space-y-4">
          {/* Weight - Disabled */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm text-customOrange">
              <Scale size={16} /> Weight ({weightUnit})
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                name="weight"
                value={form.weight}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-customGray bg-gray-100"
                disabled
              />
              <button
                type="button"
                onClick={toggleWeightUnit}
                className="px-3 py-2 bg-customGreen/10 text-customGreen rounded-lg hover:bg-customGreen/20"
              >
                {weightUnit === "kg" ? "lb" : "kg"}
              </button>
            </div>
          </div>

          {/* Height - Disabled */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm text-customOrange">
              <Ruler size={16} /> Height ({heightUnit === "cm" ? "cm" : "ft"})
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                name="height"
                value={form.height}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-customGray bg-gray-100"
                disabled
              />
              <button
                type="button"
                onClick={toggleHeightUnit}
                className="px-3 py-2 bg-customGreen/10 text-customGreen rounded-lg hover:bg-customGreen/20"
              >
                {heightUnit === "cm" ? "ft" : "cm"}
              </button>
            </div>
          </div>

          {/* Age - Disabled */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm text-customOrange">
              <Calendar size={16} /> Age
            </label>
            <input
              type="number"
              name="age"
              value={form.age}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-customGray bg-gray-100"
              disabled
            />
          </div>

          {/* Gender - Disabled */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm text-customOrange">
              <VenusAndMars size={16} /> Gender
            </label>
            <input
              type="text"
              name="gender"
              value={form.gender}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-customGray bg-gray-100"
              disabled
            />
          </div>

          {/* Goal Weight - Editable */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm text-customOrange">
              <Target size={16} /> Goal Weight ({weightUnit})
            </label>
            <input
              type="number"
              name="goalWeight"
              value={form.goalWeight}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-customOrange focus:border-customOrange text-customGray"
              min={50}
              max={120}
              step={1}
              required
            />
          </div>

          {/* Goal Body Fat - Editable */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm text-customOrange">
              <Target size={16} /> Goal Body Fat (%)
            </label>
            <input
              type="number"
              name="goalBodyFat"
              value={form.goalBodyFat}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-customOrange focus:border-customOrange text-customGray"
              min={20}
              max={35}
              step={1}
              required
            />
          </div>

          {/* Activity - Editable */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm text-customOrange">
              <Activity size={16} /> Activity Level
            </label>
            <select
              name="activity"
              value={form.activity}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-customOrange focus:border-customOrange text-customGray"
              required
            >
              <option value="Sedentary">
                Sedentary (Little to no regular exercise)
              </option>
              <option value="Mild">
                Mild (Exercise 1–3 times/week at least 20 minutes)
              </option>
              <option value="Moderate">
                Moderate (Exercise 3–4 times/week, 30–60 mins each)
              </option>
              <option value="Heavy">
                Heavy (Exercise 5–7 days/week at least 60 minutes)
              </option>
              <option value="Extreme">
                Extreme (Athlete level training or multiple sessions per day)
              </option>
            </select>
          </div>

          {/* Exercise Duration - Editable */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm text-customOrange">
              <Activity size={16} /> Exercise (min/day)
            </label>
            <input
              type="number"
              name="exerciseDuration"
              value={form.exerciseDuration}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-customOrange focus:border-customOrange text-customGray"
              min={0}
              max={500}
              required
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full mt-6 px-4 py-2 text-white rounded-lg transition-colors ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-customGreen hover:bg-green-600"
            }`}
          >
            {isSubmitting ? "Updating..." : "Update Goals"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BioData;
