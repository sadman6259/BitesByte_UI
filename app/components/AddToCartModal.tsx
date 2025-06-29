import { CrossIcon } from "@/app/components/Icons";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { cartAtom } from "../store/menuQuantityStore";
import { useAtom } from "jotai";
import { useCallback } from "react";
import {
  X,
  Utensils,
  Plus,
  Minus,
  ShoppingCart,
  Flame,
  Droplet,
  Wheat,
  Drumstick,
} from "lucide-react";
type Props = {
  setAddToCartModal: (b: boolean) => void;
};
const AddToCartModal = (props: Props) => {
  const menu = useSelector((state: RootState) => state.menu);
  const [isProtein, setIsProtein] = useState(false);
  const [isCarbs, setIsCarbs] = useState(false);
  // console.log("Selected Menu", menu);
  const [quantity, setQuantity] = useState(1);
  let price = Number(menu.price);
  if (isProtein || isCarbs) {
    price = Number(menu.pricePerGram);
  }

  // console.log("this is price", price);
  const calories = Number(menu.totalCalories);
  const fat = Number(menu.fat);
  const carbs = Number(menu.carbs);
  const protein = Number(menu.protein);
  const [totalPrice, setTotalPrice] = useState(price);
  const [totalCalories, setTotalCalories] = useState(calories);
  const [totalFat, setTotalFat] = useState(fat);
  const [totalCarbs, setTotalCarbs] = useState(carbs);
  const [totalProtein, setTotalProtein] = useState(protein);
  const [cart, setCart] = useAtom(cartAtom);
  const [imgSrc, setImgSrc] = useState(`data:image/png;base64,${menu.image}`);

  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  useEffect(() => {
    if (!menu?.subcategories) return;

    const lower = menu.subcategories.toLowerCase();
    setIsProtein(lower === "protein");
    setIsCarbs(lower === "carbs");
  }, [menu]);

  // useEffect(() => {
  //   console.log("isProtein", isProtein);
  //   console.log("isCarbs", isCarbs);
  // }, [isProtein, isCarbs]);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  // const updateTotalPriceAndNutrients = () => {
  //   setTotalPrice(Number((quantity * price).toFixed(2)));
  //   setTotalCalories(Number((quantity * calories).toFixed(2)));
  //   setTotalFat(Number((quantity * fat).toFixed(2)));
  //   setTotalCarbs(Number((quantity * carbs).toFixed(2)));
  //   setTotalProtein(Number((quantity * protein).toFixed(2)));
  // };

  const updateTotalPriceAndNutrients = useCallback(() => {
    setTotalPrice(Number((quantity * price).toFixed(2)));
    setTotalCalories(Number((quantity * calories).toFixed(2)));
    setTotalFat(Number((quantity * fat).toFixed(2)));
    setTotalCarbs(Number((quantity * carbs).toFixed(2)));
    setTotalProtein(Number((quantity * protein).toFixed(2)));
  }, [quantity, price, calories, fat, carbs, protein]);

  const addToCart = () => {
    const existingIndex = cart.findIndex(
      (item) => item.menuName === menu.menuName
    );

    if (existingIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      setCart([
        ...cart,
        {
          quantity,
          menu,
          menuName: menu.menuName,
        },
      ]);
    }
    props.setAddToCartModal(false);
  };

  useEffect(() => {
    updateTotalPriceAndNutrients();
  }, [updateTotalPriceAndNutrients]);

  return (
    // <div className="lg:h-auto md:h-100vh sm:h-100vh h-100vh">

    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="w-full max-w-md border-2 border-customOrange rounded-lg bg-customBeige overflow-hidden">
        {/* Header with Close Button */}
        <div className="bg-customOrange px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Utensils className="text-white w-5 h-5" />
            <h3 className="text-white font-bold text-lg">{menu.menuName}</h3>
          </div>
          <button
            onClick={() => props.setAddToCartModal(false)}
            className="text-white hover:scale-110 transition-transform"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4">
          {/* Image and Price Row */}
          <div className="flex flex-col gap-2 items-start mb-4">
            <div className=" w-full h-full border-2 border-customOrange rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={imgSrc}
                alt={menu.menuName}
                width={128}
                height={128}
                className=" w-full h-52 mx-auto "
                onError={() => setImgSrc("/img/slide-bg-five.jpg")}
              />
            </div>

            <div className="w-full items-center flex  justify-between h-full">
              <div>
                {!isProtein && !isCarbs && (
                  <p className="text-customGray text-sm mb-1">
                    {menu.subcategories}
                  </p>
                )}
                <p className="text-customOrange text-2xl font-bold">
                  RM {totalPrice}
                </p>
              </div>
              <button
                onClick={addToCart}
                className="self-end bg-customOrange hover:bg-orange-600 transition-colors p-2 rounded-full text-white mt-2"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Protein/Carbs or Quantity Selector */}
          {isProtein || isCarbs ? (
            <div className="bg-customGreen/10 rounded-lg p-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-customGray font-medium">
                  {isProtein ? "Protein" : "Carbs"}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={decreaseQuantity}
                    className="bg-customGreen text-white p-1 rounded hover:bg-green-600 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-customGray font-bold w-8 text-center">
                    {isProtein ? totalProtein : totalCarbs}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    className="bg-customGreen text-white p-1 rounded hover:bg-green-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-customGreen/10 rounded-lg p-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-customGray font-medium">Quantity</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={decreaseQuantity}
                    className="bg-customGreen text-white p-1 rounded hover:bg-green-600 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-customGray font-bold w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    className="bg-customGreen text-white p-1 rounded hover:bg-green-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Nutrition Highlights */}
          <div className="space-y-3">
            <h4 className="text-customGray font-bold flex items-center gap-2">
              <Flame className="text-customOrange w-5 h-5" />
              Nutritional Information
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-lg border border-customOrange/20 flex items-center gap-3">
                <div className="bg-customOrange/10 p-2 rounded-full">
                  <Flame className="w-5 h-5 text-customOrange" />
                </div>
                <div>
                  <p className="text-xs text-customGray">Calories</p>
                  <p className="text-customOrange font-bold">
                    {totalCalories}kcal
                  </p>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-customOrange/20 flex items-center gap-3">
                <div className="bg-customOrange/10 p-2 rounded-full">
                  <Drumstick className="w-5 h-5 text-customOrange" />
                </div>
                <div>
                  <p className="text-xs text-customGray">Protein</p>
                  <p className="text-customOrange font-bold">{totalProtein}g</p>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-customOrange/20 flex items-center gap-3">
                <div className="bg-customOrange/10 p-2 rounded-full">
                  <Wheat className="w-5 h-5 text-customOrange" />
                </div>
                <div>
                  <p className="text-xs text-customGray">Carbs</p>
                  <p className="text-customOrange font-bold">{totalCarbs}g</p>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-customOrange/20 flex items-center gap-3">
                <div className="bg-customOrange/10 p-2 rounded-full">
                  <Droplet className="w-5 h-5 text-customOrange" />
                </div>
                <div>
                  <p className="text-xs text-customGray">Fat</p>
                  <p className="text-customOrange font-bold">{totalFat}g</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default AddToCartModal;
