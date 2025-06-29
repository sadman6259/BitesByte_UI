export type SimpleMenuType = {
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
};
