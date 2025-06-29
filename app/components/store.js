// store.js
import { atom } from "jotai";

export const sharedWeightAtom = atom(50);
export const sharedGenderAtom = atom(null); // "male" | "female" | null
export const sharedAgeAtom = atom(0); // number
export const sharedHeightAtom = atom(0); // number
export const sharedUnitAtom = atom("CM"); // "CM" | "FT"
export const sharedActivityAtom = atom(null);

export const sharedPlanAtom = atom(null);
