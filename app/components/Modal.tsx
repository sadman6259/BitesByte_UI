"use client";
import { useState } from "react";
import Image from "next/image";
import { CrossIcon } from "./Icons";
import { useAtom } from "jotai";
import {
  sharedWeightAtom,
  sharedHeightAtom,
  sharedActivityAtom,
  sharedGenderAtom,
  sharedAgeAtom,
  sharedUnitAtom,
} from "./store";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  setcalcResultModalOpen: (open: boolean) => void;
  setPlanModalOpen: (open: boolean) => void;
};

type Gender = "male" | "female" | null;
type ActivityLevel =
  | "Sedentary"
  | "Mild"
  | "Moderate"
  | "Heavy"
  | "Extreme"
  | null;

export default function Modal({
  isOpen,
  onClose,
  setcalcResultModalOpen,
  setPlanModalOpen,
}: Props) {
  const [step, setStep] = useState(1);
  const [activityLevel, setActivityLevel] = useAtom(sharedActivityAtom);
  const [selectedGender, setSelectedGender] = useAtom(sharedGenderAtom);
  const [age, setAge] = useAtom(sharedAgeAtom);
  const [height, setHeight] = useAtom(sharedHeightAtom);
  const [weight, setWeight] = useAtom(sharedWeightAtom);
  const [unit, setUnit] = useAtom(sharedUnitAtom);

  const birthYears = Array.from({ length: 51 }, (_, i) => 2010 - i);
  const heightCM = Array.from({ length: 61 }, (_, i) => 140 + i);
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");
  const [calories, setCalories] = useState<number | null>(null);

  const calculateCalories = () => {
    if (!selectedGender || !age || !weight || !height || !activityLevel)
      return 0;

    // Convert weight to kg if it's in lbs
    const weightInKg = weightUnit === "kg" ? weight : weight * 0.453592;
    // Height is already in cm

    // Calculate BMR using Harris-Benedict equation
    let bmr = 0;
    if (selectedGender === "male") {
      bmr = 88.362 + 13.397 * weightInKg + 4.799 * height - 5.677 * age;
    } else if (selectedGender === "female") {
      bmr = 447.593 + 9.247 * weightInKg + 3.098 * height - 4.33 * age;
    }

    // Activity multiplier based on selected activity level
    let activityMultiplier = 1.2;
    switch (activityLevel) {
      case "Mild":
        activityMultiplier = 1.375;
        break;
      case "Moderate":
        activityMultiplier = 1.55;
        break;
      case "Heavy":
        activityMultiplier = 1.7;
        break;
      case "Extreme":
        activityMultiplier = 1.9;
        break;
    }

    return Math.round(bmr * activityMultiplier);
  };

  const convertToFeet = (cm: number) => {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet} FT ${inches} IN`;
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleGenderSelection = (gender: Gender) => {
    setSelectedGender(gender);
    setTimeout(() => {
      handleNext();
    }, 200);
  };

  const handleYearSelection = (year: number) => {
    const currentYear = new Date().getFullYear();
    setAge(currentYear - year);
  };

  const calcResult = () => {
    setcalcResultModalOpen(true);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-customBeige p-6 rounded-lg shadow-lg w-2/6 relative">
        <button
          className="absolute top-2 right-2 text-black-500"
          onClick={onClose}
        >
          <CrossIcon />
        </button>

        {/* Step 1: Gender Selection */}
        {step === 1 && (
          <div className="flex flex-col items-center text-center">
            {!selectedGender && (
              <Image
                src="/img/gender.png"
                alt="Choose Gender"
                width={200}
                height={60}
                layout="intrinsic"
              />
            )}
            {selectedGender === "male" && (
              <Image
                src="/img/male.png"
                alt="Male"
                width={200}
                height={60}
                layout="intrinsic"
              />
            )}
            {selectedGender === "female" && (
              <Image
                src="/img/femalef.png"
                alt="Female"
                width={200}
                height={60}
                layout="intrinsic"
              />
            )}
            <h2 className="text-xl text-black font-bold mt-4">
              CHOOSE YOUR GENDER
            </h2>
            <div className="flex mt-4 space-x-7">
              <button
                className={`px-6 py-2 rounded text-white ${
                  selectedGender === "male" ? "bg-customOrange" : "bg-green-500"
                }`}
                onClick={() => handleGenderSelection("male")}
              >
                Male
              </button>
              <button
                className={`px-6 py-2 rounded text-white ${
                  selectedGender === "female"
                    ? "bg-customOrange"
                    : "bg-green-500"
                }`}
                onClick={() => handleGenderSelection("female")}
              >
                Female
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Age Selection */}
        {step === 2 && (
          <div className="flex flex-col items-center text-center">
            <select
              className="mt-4 w-full max-h-20 border border-customOrange p-2 text-customOrange rounded overflow-auto focus:outline-none"
              defaultValue=""
              onChange={(e) => handleYearSelection(Number(e.target.value))}
            >
              <option value="" disabled className="text-customOrange">
                Select your birth year
              </option>
              {birthYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <p className="mt-10 text-2xl text-black font-bold">
              {age} YEARS OLD
            </p>
            <p className="text-lg text-customGreen mt-2 mb-4">
              Select your birth year to calculate your age.
            </p>
            <div className="flex mt-6 space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded"
                onClick={handleBack}
              >
                Back
              </button>
              <button
                className={`${
                  age ? "px-4 py-2 bg-customGreen text-white rounded" : "d-none"
                } `}
                onClick={age ? handleNext : undefined}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Weight Selection */}
        {step === 3 && (
          <div className="flex flex-col items-center text-center">
            <div className="flex justify-between w-full items-center">
              <h2 className="text-xl font-bold text-black">Weight</h2>
              <div className="flex space-x-1 items-center">
                <span className="text-black font-bold">KG</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={weightUnit === "lb"}
                    onChange={() =>
                      setWeightUnit((prev) => (prev === "kg" ? "lb" : "kg"))
                    }
                  />
                  <div className="w-14 h-8 bg-customOrange peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-customGreen rounded-full peer peer-checked:bg-customGreen">
                    <span
                      className={`block w-7 h-7 bg-white rounded-full shadow transform transition-transform ${
                        weightUnit === "lb" ? "translate-x-7" : "translate-x-0"
                      }`}
                    ></span>
                  </div>
                </label>
                <span className="text-black font-bold">LB</span>
              </div>
            </div>

            <div className="w-full mt-6 relative">
              <input
                type="range"
                min={weightUnit === "kg" ? 25 : 55}
                max={weightUnit === "kg" ? 200 : 440}
                step="1"
                value={
                  weightUnit === "kg" ? weight : Math.round(weight * 2.20462)
                }
                onChange={(e) => {
                  const newVal = parseInt(e.target.value);
                  setWeight(
                    weightUnit === "kg" ? newVal : Math.round(newVal * 0.453592)
                  );
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-customOrange"
                style={{
                  background: `linear-gradient(to right, #ff8f15 ${
                    (((weightUnit === "kg"
                      ? weight
                      : Math.round(weight * 2.20462)) -
                      (weightUnit === "kg" ? 25 : 55)) /
                      ((weightUnit === "kg" ? 200 : 440) -
                        (weightUnit === "kg" ? 25 : 55))) *
                    100
                  }%, #e5e7eb ${
                    (((weightUnit === "kg"
                      ? weight
                      : Math.round(weight * 2.20462)) -
                      (weightUnit === "kg" ? 25 : 55)) /
                      ((weightUnit === "kg" ? 200 : 440) -
                        (weightUnit === "kg" ? 25 : 55))) *
                    100
                  }%)`,
                }}
              />
            </div>
            <div className="w-full flex justify-between mt-2 text-sm text-gray-500">
              {weightUnit === "kg" ? (
                <>
                  <span>25 kg</span>
                  <span>50 kg</span>
                  <span>100 kg</span>
                  <span>150 kg</span>
                  <span>200 kg</span>
                </>
              ) : (
                <>
                  <span>55 lb</span>
                  <span>110 lb</span>
                  <span>220 lb</span>
                  <span>330 lb</span>
                  <span>440 kg</span>
                </>
              )}
            </div>
            <p className="text-4xl font-bold text-black mb-4 mt-8">
              {weightUnit === "kg"
                ? `${weight} kg`
                : `${Math.round(weight * 2.20462)} lb`}
            </p>
            <p className="text-lg text-customGreen mt-2 mb-4">
              Move the slider to indicate your weight.
            </p>
            <div className="flex mt-6 space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded"
                onClick={handleBack}
              >
                Back
              </button>
              <button
                className="px-4 py-2 bg-customGreen text-white rounded"
                onClick={handleNext}
                disabled={weight === 0}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Height Selection */}
        {step === 4 && (
          <div className="flex flex-col items-center text-center">
            <div className="w-full flex items-center justify-between mt-4">
              <select
                className="w-4/6 max-h-20 border border-customOrange p-2 text-customOrange rounded overflow-auto focus:outline-none"
                defaultValue=""
                onChange={(e) => setHeight(Number(e.target.value))}
              >
                <option value="" disabled className="text-customOrange">
                  Height options
                </option>
                {heightCM.map((cm) => (
                  <option key={cm} value={cm}>
                    {unit === "CM" ? `${cm} CM` : convertToFeet(cm)}
                  </option>
                ))}
              </select>
              <div className="flex space-x-1 items-center">
                <span className="text-black font-bold">CM</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={unit === "FT"}
                    onChange={() => setUnit(unit === "CM" ? "FT" : "CM")}
                  />
                  <div className="w-14 h-8 bg-customOrange peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-customGreen rounded-full peer peer-checked:bg-customGreen">
                    <span
                      className={`block w-7 h-7 bg-white rounded-full shadow transform transition-transform ${
                        unit === "FT" ? "translate-x-7" : "translate-x-0"
                      }`}
                    ></span>
                  </div>
                </label>
                <span className="text-black font-bold">FT</span>
              </div>
            </div>
            <p className="mt-10 text-4xl text-black font-bold">
              {unit === "CM" ? `${height} CM` : convertToFeet(height)}
            </p>
            <p className="text-lg text-customGreen mb-4">
              Please select your height from the dropdown.
            </p>
            <div className="flex mt-6 space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded"
                onClick={handleBack}
              >
                Back
              </button>
              <button
                className={`${
                  height
                    ? "px-4 py-2 bg-customGreen text-white rounded"
                    : "d-none"
                }`}
                onClick={height ? handleNext : undefined}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="flex flex-col items-center text-center">
            <h2 className="text-xl font-bold text-black mb-4">
              SELECT YOUR ACTIVITY LEVEL
            </h2>
            <div className="flex flex-col space-y-4 w-full max-w-md">
              {[
                {
                  label: "Sedentary",
                  multiplier: 1.2,
                  description: "Little to no regular exercise",
                },
                {
                  label: "Mild",
                  multiplier: 1.375,
                  description: "Exercise 1–3 times/week at least  20 minutes ",
                },
                {
                  label: "Moderate",
                  multiplier: 1.55,
                  description: "Exercise 3–4 times/week, 30–60 mins each",
                },
                {
                  label: "Heavy",
                  multiplier: 1.7,
                  description: "Exercise 5–7 days/week at least 60 minutes ",
                },
                {
                  label: "Extreme",
                  multiplier: 1.9,
                  description:
                    "Athlete level training or multiple sessions per day",
                },
              ].map(({ label, description }) => (
                <button
                  key={label}
                  className={`px-6 py-3 rounded text-white text-left ${
                    activityLevel === label ? "bg-customOrange" : "bg-green-500"
                  }`}
                  onClick={() => setActivityLevel(label as ActivityLevel)}
                >
                  <span className="block font-semibold">{label}</span>
                  <span className="text-sm">{description}</span>
                </button>
              ))}
            </div>
            <div className="flex mt-6 space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded"
                onClick={handleBack}
              >
                Back
              </button>
              {activityLevel && (
                <button
                  className="px-4 py-2 bg-customGreen text-white rounded"
                  onClick={handleNext}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 6: Confirmation */}
        {step === 6 && (
          <div className="flex flex-col items-center text-center">
            <div className="w-3/5 my-6">
              <h2 className="border-y-2 border-customOrange text-xl text-black p-2 font-serif font-bold">
                Gender - {selectedGender}
              </h2>
              <h2 className="border-b-2 border-customOrange text-xl text-black p-2 font-serif font-bold">
                Age - {age}
              </h2>
              <h2 className="border-b-2 border-customOrange text-xl text-black p-2 font-serif font-bold">
                Weight -{" "}
                {weightUnit === "kg"
                  ? `${weight} kg`
                  : `${Math.round(weight * 2.20462)} lb`}
              </h2>
              <h2 className="border-b-2 border-customOrange text-xl text-black p-2 font-serif font-bold">
                Height -{" "}
                {unit === "CM" ? `${height} CM` : convertToFeet(height)}
              </h2>

              <h2 className="border-b-2 border-customOrange text-xl text-black p-2 font-serif font-bold">
                Activity - {activityLevel}
              </h2>
            </div>

            <div className="flex mt-6 space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded"
                onClick={handleBack}
              >
                Back
              </button>
              <button
                className="px-4 py-2 bg-customGreen text-white rounded"
                onClick={() => {
                  const calcCalories = calculateCalories();
                  setCalories(calcCalories);
                  handleNext(); // move to step 7
                }}
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="fixed inset-0 flex items-center justify-center bg-black text-black bg-opacity-50 z-50">
            <div className="bg-customBeige p-6 rounded-lg shadow-lg w-1/2 relative">
              <button
                className="absolute top-2 right-5 text-black-500"
                onClick={onClose}
              >
                <CrossIcon />
              </button>
              <div className="mt-5 flex justify-between">
                <div className="rounded-lg shadow-md w-full md:w-3/4 lg:w-full xl:w-full">
                  <div className="p-4 bg-white border-2 border-customOrange mb-6">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold font-custom">
                        Your Stats
                      </h2>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="table-auto w-full border-collapse border border-black">
                        <tbody>
                          <tr>
                            <td className="border-2 border-black px-3">
                              Height
                            </td>
                            <td className="border-2 border-black px-3">
                              {unit === "CM"
                                ? `${height} CM`
                                : convertToFeet(height)}
                            </td>
                          </tr>
                          <tr className="bg-gray-50">
                            <td className="border-2 border-black px-3">
                              Weight
                            </td>
                            <td className="border-2 border-black px-3">
                              {weightUnit === "kg"
                                ? `${weight} kg`
                                : `${Math.round(weight * 2.20462)} lb`}
                            </td>
                          </tr>
                          <tr>
                            <td className="border-2 border-black px-3">Age</td>
                            <td className="border-2 border-black px-3">
                              {age}
                            </td>
                          </tr>
                          <tr className="bg-gray-50">
                            <td className="border-2 border-black px-3">
                              Gender
                            </td>
                            <td className="border-2 border-black px-3">
                              {selectedGender}
                            </td>
                          </tr>
                          <tr>
                            <td className="border-2 border-black px-3">
                              Activity Level
                            </td>
                            <td className="border-2 border-black px-3">
                              {activityLevel}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="text-center border-2 border-customOrange bg-white py-11 shadow-inner">
                    <h3 className="text-2xl font-bold font-custom">
                      Your Maintenance Calories
                    </h3>
                    <p className="text-4xl font-bold font-custom">
                      {calories ?? "Calculating..."}
                    </p>
                    <p className="font-custom text-xl">per day</p>
                  </div>
                </div>

                <div className="bg-white border-2 border-customOrange p-2 shadow-md w-full md:w-3/4 lg:w-full xl:w-full mt-6 md:mt-0 md:ml-6">
                  <p className="mb-6 leading-loose text-justify font-custom text-xl">
                    Based on your stats, the best estimate for your maintenance
                    calories is {calories ?? "Calculating..."} calories per day.
                    <br /> Understanding your calories for weight maintenance is
                    a crucial first step into your specific nutrition
                    requirements. Tell us more about what you wish to achieve
                    with your nutrition.
                  </p>
                  <div className="flex justify-center">
                    <button
                      className="px-4 py-2 bg-gray-300 text-black rounded"
                      onClick={handleBack}
                    >
                      Back
                    </button>
                    <button
                      className="px-4 py-2 ml-5 bg-green-500 text-white rounded hover:bg-green-600"
                      onClick={() => {
                        calcResult();
                        setPlanModalOpen(true);
                      }}
                    >
                      Choose a Plan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
