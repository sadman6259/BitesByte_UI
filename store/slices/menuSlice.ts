import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MenuItem {
    id: number;
    image: string;
    menuName: string;
    price: number;
    category: string;
    totalCalories: number;
    fat: number;
    carbs: number;
    plan: string;
    pricePerGram: number | null;
    protein: number;
    subcategories: string | null;
    weekNumber: number | null;
}

const initialState: MenuItem = {
    id: 1,
    image: "/img/Micro_Menu/scrambled egg.jpg",
    menuName: "Scrambled Eggs",
    price: 33,
    category: "Protein",
    totalCalories: 22,
    fat: 34,
    carbs: 33,
    plan: "dsf",
    pricePerGram: 2345,
    protein: 345,
    subcategories: "some",
    weekNumber:3
};

const menuSlice = createSlice({
    name: "menu",
    initialState,
    reducers: {
        updateMenu: (state, action: PayloadAction<Partial<MenuItem>>) => {
            return { ...state, ...action.payload };
        },
    },
});

export const { updateMenu } = menuSlice.actions;
export default menuSlice.reducer;
