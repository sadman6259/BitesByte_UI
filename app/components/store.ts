// store.js
import { atom } from "jotai";

export type Gender = "male" | "female" | null;
export type ActivityLevel =
  | "Sedentary"
  | "Mild"
  | "Moderate"
  | "Heavy"
  | "Extreme"
  | null;

  export interface Plan {
  title: string;
}
export const sharedWeightAtom = atom(50);
export const sharedGenderAtom = atom<Gender>(null);
export const sharedActivityAtom = atom<ActivityLevel>(null);
export const sharedAgeAtom = atom(0); // number
export const sharedHeightAtom = atom(0); // number
export const sharedUnitAtom = atom("CM"); // "CM" | "FT"

export const sharedPlanAtom = atom<Plan | null>(null);;
