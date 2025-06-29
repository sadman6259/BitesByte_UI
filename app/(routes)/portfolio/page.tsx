"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { sharedPlanAtom } from "../../components/store";
import {
  User,
  Mail,
  Scale,
  Dumbbell,
  AlertTriangle,
  CreditCard,
  CalendarCheck,
  Trash2,
  ChevronDown,
  Loader2,
  Ruler,
  Calendar,
  Activity,
  VenusAndMars,
  Target,
} from "lucide-react";

interface UserData {
  id: number;
  name: string;
  email: string;
  goalWeight: number;
  goalBodyFat: number;
  foodAllergies: boolean;
  avgExerciseDuration: number;
  currentWeight?: number;
  subscriptionActive?: boolean;
  currentPlan?: string;
  activity?: string;
  age?: number;
  height?: number;
  gender?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPlanOptions, setShowPlanOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    goalWeight: "",
    goalBodyFat: "",
    avgExerciseDuration: "",
    activity: "",
  });
  const [, setCurrentPlan] = useAtom(sharedPlanAtom);

  const plans = ["Weight Loss", "Maintenance", "Lean Body Mass", "Muscle Gain"];

  useEffect(() => {
    const email = localStorage.getItem("userEmail");

    if (!email) {
      setLoading(false);
      console.error("No email found in localStorage.");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${
            process.env.NEXT_PUBLIC_BITESBYTE_API_URL
          }/getuserbyemail?email=${encodeURIComponent(email)}`
        );
        const userData = {
          ...res.data,
          subscriptionActive: res.data.subscriptionActive ?? true,
          currentPlan: res.data.plan || "Weight Loss",
        };
        setUser(userData);
        setCurrentPlan(userData.currentPlan);

        // Initialize form data
        setFormData({
          goalWeight: res.data.goalWeight.toString(),
          goalBodyFat: res.data.goalBodyFat.toString(),
          avgExerciseDuration: res.data.avgExerciseDuration.toString(),
          activity: res.data.activity || "",
        });
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [setCurrentPlan]);

  const handlePlanChange = async (plan: string) => {
    try {
      setIsSubmitting(true);
      setUser((prev) => (prev ? { ...prev, currentPlan: plan } : null));
      setShowPlanOptions(false);
      // setCurrentPlan(plan); // This should now work if your atom is properly typed

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BITESBYTE_API_URL}/updateuser`,
        {
          id: user?.id,
          plan: plan,
          name: user?.name,
          email: user?.email,
          goalWeight: user?.goalWeight,
          goalBodyFat: user?.goalBodyFat,
          foodAllergies: user?.foodAllergies,
          avgExerciseDuration: user?.avgExerciseDuration,
          height: user?.height,
          gender: user?.gender,
          age: user?.age,
          currentWeight: user?.currentWeight,
          activity: user?.activity,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Plan updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        throw new Error("Failed to update plan");
      }
    } catch (err) {
      console.error("Failed to update plan:", err);

      let errorMessage = "Failed to update plan. Please try again.";

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setErrorMessage(errorMessage);
      setTimeout(() => setErrorMessage(""), 3000);

      setUser((prev) =>
        prev ? { ...prev, currentPlan: user?.currentPlan } : null
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelSubscription = async () => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BITESBYTE_API_URL}/updateuser/${user?.id}`,
        {
          subscriptionActive: false,
        }
      );
      setUser((prev) => (prev ? { ...prev, subscriptionActive: false } : null));
    } catch (err) {
      console.error("Failed to cancel subscription:", err);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing && user) {
      setFormData({
        goalWeight: user.goalWeight.toString(),
        goalBodyFat: user.goalBodyFat.toString(),
        avgExerciseDuration: user.avgExerciseDuration.toString(),
        activity: user.activity || "",
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleWeightUnit = () => {
    const newUnit = weightUnit === "kg" ? "lb" : "kg";

    if (formData.goalWeight) {
      const goalWeight = parseFloat(formData.goalWeight);
      const convertedGoalWeight =
        weightUnit === "kg"
          ? (goalWeight * 2.20462).toFixed(1)
          : (goalWeight / 2.20462).toFixed(1);
      setFormData((prev) => ({ ...prev, goalWeight: convertedGoalWeight }));
    }

    setWeightUnit(newUnit);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Convert goalWeight to kg if in lbs
      const goalWeightInKg =
        weightUnit === "lb"
          ? parseFloat(formData.goalWeight) / 2.20462
          : parseFloat(formData.goalWeight);

      const updateData = {
        goalWeight: goalWeightInKg,
        goalBodyFat: parseFloat(formData.goalBodyFat),
        avgExerciseDuration: parseFloat(formData.avgExerciseDuration),
        activity: formData.activity,
        plan: user?.currentPlan, // Include current plan
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BITESBYTE_API_URL}/updateuser`,
        {
          id: user?.id,
          ...updateData,
          name: user?.name,
          email: user?.email,
          password: "",
          gender: user?.gender,
          age: user?.age,
          height: user?.height,
          currentWeight: user?.currentWeight,
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

        // Update user data
        setUser((prev) => (prev ? { ...prev, ...updateData } : null));
        setIsEditing(false);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-customBeige/50 to-customBeige">
        <Loader2 className="animate-spin text-customGreen h-12 w-12" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-customBeige/50 to-customBeige">
        <p className="text-red-500 text-lg">User not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-customBeige/50 to-customBeige p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-customOrange mb-3">
            My Profile
          </h1>
          <div className="w-32 h-1.5 bg-gradient-to-r from-customGreen to-customOrange mx-auto rounded-full"></div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-customGreen/10 to-customOrange/10 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 border-b border-gray-200">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-customGreen/20 to-customOrange/20 flex items-center justify-center shadow-inner">
              <User className="text-customGreen" size={42} />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-customGray">
                {user.name}
              </h2>
              <p
                className={`text-sm font-medium px-3 py-1 rounded-full inline-flex items-center mt-2 ${
                  user.subscriptionActive
                    ? "bg-customGreen/20 text-customGreen"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {user.subscriptionActive ? (
                  <>
                    <span className="w-2 h-2 bg-customGreen rounded-full mr-2"></span>
                    Premium Member
                  </>
                ) : (
                  "Basic Member"
                )}
              </p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6 md:p-8 space-y-8">
            {/* Personal Info Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-customGray border-b pb-2 border-gray-200 flex items-center">
                <User className="text-customOrange mr-2" size={20} />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileField
                  icon={<User className="text-customOrange" />}
                  label="Name"
                  value={user.name}
                />

                <ProfileField
                  icon={<VenusAndMars className="text-customOrange" />}
                  label="Gender"
                  value={user.gender}
                />
                <ProfileField
                  icon={<Mail className="text-customOrange" />}
                  label="Email"
                  value={user.email}
                />
                {user.height && (
                  <ProfileField
                    icon={<Ruler className="text-customOrange" />}
                    label="Height"
                    value={`${user.height} cm`}
                  />
                )}
                {user.age && (
                  <ProfileField
                    icon={<Calendar className="text-customOrange" />}
                    label="Age"
                    value={`${user.age} years`}
                  />
                )}

                {user.currentWeight && (
                  <ProfileField
                    icon={<Scale className="text-customOrange" />}
                    label="Current Weight"
                    value={`${user.currentWeight} kg`}
                  />
                )}
              </div>
            </div>

            {/* Fitness Goals Section */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-customGray border-b pb-2 border-gray-200 flex items-center">
                  <Target className="text-customOrange mr-2" size={20} />
                  Fitness Goals
                </h3>
                <button
                  onClick={toggleEdit}
                  className={`text-sm font-medium text-white p-3 rounded-md transition-colors ${
                    isEditing ? "bg-customGray" : "bg-customGreen"
                  }`}
                >
                  {isEditing ? "Cancel" : "Edit"}
                </button>
              </div>

              {successMessage && (
                <div className="p-3 bg-green-100 text-green-700 rounded-lg">
                  {successMessage}
                </div>
              )}

              {errorMessage && (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isEditing ? (
                  <>
                    {/* Editable Goal Weight */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-customOrange p-2 bg-customOrange/10 rounded-lg">
                          <Target className="text-customOrange" />
                        </div>
                        <div>
                          <p className="text-sm text-customOrange font-medium">
                            Goal Weight
                          </p>
                          <div className="flex gap-2 items-center">
                            <input
                              type="number"
                              name="goalWeight"
                              value={formData.goalWeight}
                              onChange={handleInputChange}
                              className="w-24 px-3 py-1 border border-gray-300 rounded-lg focus:ring-customOrange focus:border-customOrange text-customGray"
                              min={30}
                              max={300}
                              step={0.1}
                            />
                            <button
                              onClick={toggleWeightUnit}
                              className="text-xs px-2 py-1 bg-customOrange/10 text-customOrange rounded hover:bg-customOrange/20"
                            >
                              {weightUnit}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Editable Goal Body Fat */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-customOrange p-2 bg-customOrange/10 rounded-lg">
                          <Target className="text-customOrange" />
                        </div>
                        <div>
                          <p className="text-sm text-customOrange font-medium">
                            Goal Body Fat
                          </p>
                          <input
                            type="number"
                            name="goalBodyFat"
                            value={formData.goalBodyFat}
                            onChange={handleInputChange}
                            className="w-24 px-3 py-1 border border-gray-300 rounded-lg focus:ring-customOrange focus:border-customOrange text-customGray"
                            min={5}
                            max={50}
                            step={0.1}
                          />
                          <span className="ml-2 text-customGray">%</span>
                        </div>
                      </div>
                    </div>

                    {/* Editable Avg Exercise */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-customOrange p-2 bg-customOrange/10 rounded-lg">
                          <Dumbbell className="text-customOrange" />
                        </div>
                        <div>
                          <p className="text-sm text-customOrange font-medium">
                            Avg Exercise
                          </p>
                          <input
                            type="number"
                            name="avgExerciseDuration"
                            value={formData.avgExerciseDuration}
                            onChange={handleInputChange}
                            className="w-24 px-3 py-1 border border-gray-300 rounded-lg focus:ring-customOrange focus:border-customOrange text-customGray"
                            min={0}
                            max={500}
                          />
                          <span className="ml-2 text-customGray">min/day</span>
                        </div>
                      </div>
                    </div>

                    {/* Editable Activity Level */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-customOrange p-2 bg-customOrange/10 rounded-lg">
                          <Activity className="text-customOrange" />
                        </div>
                        <div>
                          <p className="text-sm text-customOrange font-medium">
                            Activity Level
                          </p>
                          <select
                            name="activity"
                            value={formData.activity}
                            onChange={handleInputChange}
                            className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-customOrange focus:border-customOrange text-customGray"
                          >
                            <option value="Sedentary">Sedentary</option>
                            <option value="Mild">Mild</option>
                            <option value="Moderate">Moderate</option>
                            <option value="Heavy">Heavy</option>
                            <option value="Extreme">Extreme</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Editable Plan Selection */}
                    <div className="flex items-start justify-between md:col-span-2">
                      <div className="flex items-center gap-3 w-full">
                        <div className="text-customOrange p-2 bg-customOrange/10 rounded-lg">
                          <CalendarCheck className="text-customOrange" />
                        </div>
                        <div className="w-full">
                          <p className="text-sm text-customOrange font-medium">
                            Current Plan
                          </p>
                          <div className="relative w-full">
                            <button
                              onClick={() =>
                                setShowPlanOptions(!showPlanOptions)
                              }
                              className="w-full text-left px-3 py-1 border border-gray-300 rounded-lg flex justify-between items-center text-customGray"
                            >
                              {user.currentPlan}
                              <ChevronDown
                                className={`ml-1 transition-transform ${
                                  showPlanOptions ? "rotate-180" : ""
                                }`}
                                size={16}
                              />
                            </button>

                            {showPlanOptions && (
                              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                {plans.map((plan) => (
                                  <button
                                    key={plan}
                                    onClick={() => {
                                      handlePlanChange(plan);
                                      setShowPlanOptions(false);
                                    }}
                                    className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                                      plan === user.currentPlan
                                        ? "bg-customGreen/10 text-customGreen"
                                        : "text-customGray hover:bg-gray-100"
                                    }`}
                                  >
                                    {plan}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Food Allergies (readonly) */}
                    <ProfileField
                      icon={<AlertTriangle className="text-customOrange" />}
                      label="Food Allergies"
                      value={user.foodAllergies ? "Yes" : "No"}
                      valueClassName={
                        user.foodAllergies ? "text-red-500" : "text-customGreen"
                      }
                    />

                    {/* Save Button */}
                    <div className="md:col-span-2 flex justify-end">
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`px-4 py-2 text-white rounded-lg ${
                          isSubmitting
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-customGreen hover:bg-green-600"
                        }`}
                      >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Readonly view */}
                    <ProfileField
                      icon={<Target className="text-customOrange" />}
                      label="Goal Weight"
                      value={`${user.goalWeight} kg`}
                    />

                    <ProfileField
                      icon={<Target className="text-customOrange" />}
                      label="Goal Body Fat"
                      value={`${user.goalBodyFat} %`}
                    />

                    <ProfileField
                      icon={<Dumbbell className="text-customOrange" />}
                      label="Avg Exercise"
                      value={`${user.avgExerciseDuration} min/day`}
                    />

                    <ProfileField
                      icon={<AlertTriangle className="text-customOrange" />}
                      label="Food Allergies"
                      value={user.foodAllergies ? "Yes" : "No"}
                      valueClassName={
                        user.foodAllergies ? "text-red-500" : "text-customGreen"
                      }
                    />

                    {user.activity && (
                      <ProfileField
                        icon={<Activity className="text-customOrange" />}
                        label="Activity Level"
                        value={user.activity}
                      />
                    )}

                    {/* Readonly Plan */}
                    <ProfileField
                      icon={<CalendarCheck className="text-customOrange" />}
                      label="Current Plan"
                      value={user.currentPlan}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Subscription & Plan Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-customGray border-b pb-2 border-gray-200 flex items-center">
                <CreditCard className="text-customOrange mr-2" size={20} />
                Membership
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ProfileField
                    icon={<CreditCard className="text-customOrange" />}
                    label="Subscription Status"
                    value={user.subscriptionActive ? "Active" : "Inactive"}
                    valueClassName={
                      user.subscriptionActive
                        ? "text-customGreen"
                        : "text-gray-500"
                    }
                    action={
                      user.subscriptionActive && (
                        <button
                          onClick={cancelSubscription}
                          className="text-sm font-medium flex items-center text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="mr-1" size={16} /> Cancel
                        </button>
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileField({
  icon,
  label,
  value,
  action,
  valueClassName = "text-customGray",
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number | undefined;
  action?: React.ReactNode;
  valueClassName?: string;
}) {
  if (!value) return null;

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className="text-customOrange p-2 bg-customOrange/10 rounded-lg">
          {icon}
        </div>
        <div>
          <p className="text-sm text-customOrange font-medium">{label}</p>
          <p className={`font-medium ${valueClassName}`}>{value}</p>
        </div>
      </div>
      {action && <div className="self-center">{action}</div>}
    </div>
  );
}
