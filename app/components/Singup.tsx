import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Scale,
  Activity,
  Clock,
  AlertTriangle,
  Check,
} from "lucide-react";
import { useAtom } from "jotai";
import {
  sharedWeightAtom,
  sharedHeightAtom,
  sharedAgeAtom,
  sharedGenderAtom,
  sharedActivityAtom,
  sharedPlanAtom,
} from "./store";
import axios from "axios";
import bcrypt from "bcryptjs";
interface Plan {
  title: string;
  // Add other plan properties as needed
}
function Signup({ onClose }: { onClose: () => void; plan?: Plan }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [weight, setWeight] = useState(60);
  const [bodyFat, setBodyFat] = useState(20);
  const [currentWeight] = useAtom(sharedWeightAtom);
  const [currentHeight] = useAtom(sharedHeightAtom);
  const [currentAge] = useAtom(sharedAgeAtom);
  const [currentGender] = useAtom(sharedGenderAtom);
  const [currentActivity] = useAtom(sharedActivityAtom);
  const [currentPlan] = useAtom(sharedPlanAtom);

  const [exerciseTime, setExerciseTime] = useState(30);
  const [unit, setUnit] = useState<"kg" | "lb">("kg");
  const [agreeAllergyWarning, setAgreeAllergyWarning] = useState(false);
  const [selectedAllergy, setSelectedAllergy] = useState<string>("no");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setWeight(0);
    setBodyFat(0);
  }, []);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isFormValid =
    name.trim() !== "" &&
    email.trim() !== "" &&
    isValidEmail(email) &&
    password.trim() !== "" &&
    password.length >= 8 &&
    confirmPassword.trim() !== "" &&
    password === confirmPassword &&
    weight > 0 &&
    bodyFat > 0 &&
    (selectedAllergy === "no" ||
      (selectedAllergy === "yes" && agreeAllergyWarning)) &&
    currentHeight &&
    currentWeight &&
    currentAge &&
    currentGender &&
    currentPlan &&
    currentActivity;

  const convertToKg = (lb: number) => Math.round(lb / 2.20462);
  const convertToLb = (kg: number) => Math.round(kg * 2.20462);

  const handleUnitToggle = () => {
    setUnit(unit === "kg" ? "lb" : "kg");
    setWeight(unit === "kg" ? convertToLb(weight) : convertToKg(weight));
  };

  const handleLoginAfterSignup = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BITESBYTE_API_URL}/loginUser`,
        {
          email: email.trim().toLowerCase(),
          password: password,
        }
      );

      const data = response.data;

      if (data === false) {
        setError("Auto-login failed. Please login manually.");
        return false;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", email.trim().toLowerCase());
      document.cookie = `token=${data.token}; path=/; samesite=lax`;
      return true;
    } catch (error) {
      console.error("Auto-login error:", error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (
      !currentHeight ||
      !currentWeight ||
      !currentAge ||
      !currentGender ||
      !currentPlan ||
      !currentActivity
    ) {
      setError("Please complete all profile information before signing up");
      setIsLoading(false);
      return;
    }

    try {
      // Hash passwords before sending to server
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const hashedConfirmPassword = await bcrypt.hash(confirmPassword, salt);
      console.log(hashedPassword, "hashedPassword");

      const payload = {
        id: 0,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        confirmPassword: hashedConfirmPassword,
        goalWeight: Number(weight),
        goalBodyFat: Number(bodyFat),
        foodAllergies: selectedAllergy === "yes",
        avgExerciseDuration: Number(exerciseTime),
        height: Number(currentHeight),
        gender: currentGender,
        age: Number(currentAge),
        currentWeight: Number(currentWeight),
        activity: currentActivity,
        plan: currentPlan?.title,
      };

      console.log("Sending payload:", payload);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BITESBYTE_API_URL}/registerUser`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Registration successful:", res.data);

      // Attempt to login automatically after successful registration
      const loginSuccess = await handleLoginAfterSignup();

      if (loginSuccess) {
        setShowSuccessModal(true);
      } else {
        setError(
          "Account created but auto-login failed. Please login manually."
        );
      }
    } catch (err: unknown) {
      let errorMessage = "Registration failed. Please try again.";

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    setShowSuccessModal(false);
    onClose();
    router.push("/portfolio");
  };

  const handleCancel = () => {
    setShowSuccessModal(false);
    onClose();
  };
  return (
    <div className="fixed inset-0 flex items-start justify-center bg-black/50 z-50 overflow-y-auto py-4">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="text-center">
              <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                You are logged in!
              </h3>
              <p className="text-gray-500 mb-6">
                Your account has been successfully created.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customOrange"
                >
                  Cancel
                </button>
                <button
                  onClick={handleContinue}
                  className="px-4 py-2 bg-customOrange text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customOrange"
                >
                  Continue to Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-customBeige rounded-lg shadow-lg w-full max-w-2xl relative mx-4 border border-customGray/20 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-customGray hover:text-customOrange transition-colors p-1"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-customOrange font-custom tracking-custom">
              CREATE ACCOUNT
            </h1>
            <p className="text-customGray mt-2">
              Join us to start your fitness journey
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-lg mb-4 border border-red-200">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-customGreen mb-1">
                Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-customGray" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-customOrange rounded focus:ring-1 focus:ring-customGreen focus:border-customGreen outline-none bg-white"
                  placeholder="Your name"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-customGreen mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-customGray" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-customOrange rounded focus:ring-1 focus:ring-customGreen focus:border-customGreen outline-none bg-white"
                  placeholder="your@email.com"
                  required
                />
              </div>
              {email && !isValidEmail(email) && (
                <p className="mt-1 text-sm text-red-600">
                  Please enter a valid email
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-customGreen mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-customGray" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-customOrange rounded focus:ring-1 focus:ring-customGreen focus:border-customGreen outline-none bg-white"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-customGray hover:text-customOrange"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-customGreen mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-customGray" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-customOrange rounded focus:ring-1 focus:ring-customGreen focus:border-customGreen outline-none bg-white"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-customGray hover:text-customOrange"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Weight Goals Section */}
            <div className="bg-white p-4 rounded-lg border border-customGray/20">
              <div className="bg-customBeige p-3 mb-3 rounded-lg border border-customGray/20">
                <div className="text-xs text-customGray mb-1">
                  Current Weight
                </div>
                <div className="text-customGreen font-medium">
                  {unit === "kg" ? currentWeight : convertToLb(currentWeight)}{" "}
                  {unit} <br />
                </div>
              </div>
              <h3 className="flex items-center gap-2 text-sm font-medium text-customGreen mb-3">
                <Scale className="w-5 h-5 text-customOrange" />
                Weight Goals
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <button
                      onClick={handleUnitToggle}
                      className="text-xs text-customOrange hover:text-customGreen"
                    >
                      Switch to {unit === "kg" ? "lb" : "kg"}
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={unit === "kg" ? 25 : 55}
                      max={unit === "kg" ? 120 : 265}
                      value={weight}
                      onChange={(e) => setWeight(Number(e.target.value))}
                      className="w-full h-2 bg-customBeige rounded-lg appearance-none cursor-pointer accent-customOrange"
                    />
                    <div className="w-16 text-center">
                      <div className="text-customOrange font-medium">
                        {weight}
                      </div>
                      <div className="text-xs text-customGray">{unit}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Body Fat Goals Section */}
            <div className="bg-white p-4 rounded-lg border border-customGray/20">
              <h3 className="flex items-center gap-2 text-sm font-medium text-customGreen mb-3">
                <Activity className="w-5 h-5 text-customOrange" />
                Body Fat Goals
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="5"
                      max="30"
                      value={bodyFat}
                      onChange={(e) => setBodyFat(Number(e.target.value))}
                      className="w-full h-2 bg-customBeige rounded-lg appearance-none cursor-pointer accent-customOrange"
                    />
                    <div className="w-16 text-center">
                      <div className="text-customOrange font-medium">
                        {bodyFat}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exercise Duration */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-customGreen mb-1">
                <Clock className="w-5 h-5 text-customOrange" />
                Average Exercise Duration (minutes)
              </label>
              <input
                type="number"
                min="0"
                max="300"
                value={exerciseTime}
                onChange={(e) => setExerciseTime(Number(e.target.value))}
                className="w-full px-4 py-2 border border-customOrange rounded focus:ring-1 focus:ring-customGreen focus:border-customGreen outline-none bg-white"
                placeholder="e.g. 45"
              />
            </div>

            {/* Allergies Section */}
            <div className="bg-white p-4 rounded-lg border border-customGray/20">
              <h3 className="flex items-center gap-2 text-sm font-medium text-customGreen mb-3">
                <AlertTriangle className="w-5 h-5 text-customOrange" />
                Food Allergies / Medical Conditions
              </h3>

              <div className="space-y-3">
                <div className="flex gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="allergies"
                      value="yes"
                      checked={selectedAllergy === "yes"}
                      onChange={() => setSelectedAllergy("yes")}
                      className="h-4 w-4 text-customOrange border-customGray focus:ring-customGreen"
                    />
                    <span className="ml-2 text-customGray">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="allergies"
                      value="no"
                      checked={selectedAllergy === "no"}
                      onChange={() => setSelectedAllergy("no")}
                      className="h-4 w-4 text-customOrange border-customGray focus:ring-customGreen"
                    />
                    <span className="ml-2 text-customGray">No</span>
                  </label>
                </div>

                {selectedAllergy === "yes" && (
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                    <label className="inline-flex items-start">
                      <input
                        type="checkbox"
                        checked={agreeAllergyWarning}
                        onChange={(e) =>
                          setAgreeAllergyWarning(e.target.checked)
                        }
                        className="h-4 w-4 text-customOrange border-customGray rounded focus:ring-customGreen mt-1"
                      />
                      <span className="ml-2 text-sm text-customGray">
                        I understand that I should consult my physician before
                        starting a new diet.
                      </span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`w-full flex justify-center items-center gap-2 py-3 px-4 rounded font-medium transition-colors ${
                isFormValid
                  ? "bg-customGreen hover:bg-green-700 text-white"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  <span>CREATE ACCOUNT</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
