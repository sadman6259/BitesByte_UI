import { useEffect, useState } from "react";
import Image from "next/image";
import { SimpleMenuType } from "../type/SimpleMenuType";
import { useDispatch } from "react-redux";
import { updateMenu } from "@/store/slices/menuSlice";
import { useAtom } from "jotai";
import { cartAtom } from "../store/menuQuantityStore";

type Props = {
  item: SimpleMenuType;
  colorInverse?: boolean;
  setOnAddToCart?: (b: boolean) => void;
  isProtein?: boolean;
  isCarb?: boolean;
  isSelected?: boolean;
  isSuggestion?: boolean;
  count?: number;
  index?: number;
};

const MenuBox = (props: Props) => {
  const { item, colorInverse, isSelected, index } = props;
  const dispatch = useDispatch();

  const addToCart = (item: SimpleMenuType) => {
    dispatch(updateMenu(item));
    props.setOnAddToCart?.(true);
  };

  const [imgSrc, setImgSrc] = useState(`data:image/png;base64,${item.image}`);
  const [menuQuantity, setMenuQuantity] = useState(1);
  const [cart, setCart] = useAtom(cartAtom);
  const [showQuantityControls, setShowQuantityControls] = useState(false);

  useEffect(() => {
    // Find cart item by comparing menuName in cart.menu.menuName
    const existingItem = cart.find(
      (cartItem) => cartItem.menu.menuName === item.menuName
    );
    if (existingItem) {
      setMenuQuantity(existingItem.quantity);
    } else {
      setMenuQuantity(1);
    }
  }, [cart, item.menuName]);

  const updateQuantity = (change: number) => {
    const existingItemIndex = cart.findIndex(
      (c) => c.menu.menuName === item.menuName
    );

    if (existingItemIndex !== -1) {
      const newCart = [...cart];
      const updatedQuantity = newCart[existingItemIndex].quantity + change;

      if (updatedQuantity <= 0) {
        // Remove the item if quantity drops to 0 or less
        newCart.splice(existingItemIndex, 1);
      } else {
        newCart[existingItemIndex] = {
          ...newCart[existingItemIndex],
          quantity: updatedQuantity,
        };
      }

      setCart(newCart);
    } else if (change > 0) {
      // Add new item with correct CartItem shape
      setCart([...cart, { menu: item, quantity: 1, menuName: item.menuName }]);
    }
  };

  return (
    <div
      className={`relative flex flex-col items-center rounded-lg p-2 bg-white lg:h-[180px] md:h-[150px] h-auto sm:h-auto`}
    >
      {props.isSelected && (
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg z-10 flex justify-end items-start">
          <div className="flex items-center">
            {showQuantityControls && (
              <>
                <button
                  onClick={() => updateQuantity(-1)}
                  className="px-2 py-1 w-8 h-8 bg-red-500 text-white rounded-full font-bold text-xl flex justify-center items-center"
                >
                  -
                </button>
              </>
            )}
            <div
              onClick={() => setShowQuantityControls((prev) => !prev)}
              className="w-12 h-12 mx-2 cursor-pointer font-bold bg-white rounded-full z-20 shadow-lg border-2 border-white flex justify-center items-center text-xl"
            >
              {menuQuantity}
            </div>
            {showQuantityControls && (
              <>
                <button
                  onClick={() => updateQuantity(1)}
                  className="px-2 py-1 w-8 h-8 bg-green-500 text-white font-bold rounded-full text-xl flex justify-center items-center"
                >
                  +
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="md:flex lg:flex block w-full md:w-full items-center justify-start mb-1">
        <div
          className={`relative flex-none md:h-[130px] h-[300px] md:w-[200px] w-full rounded-md overflow-hidden mb-[3px]`}
        >
          <Image
            src={imgSrc}
            alt={item.menuName}
            fill
            className="hover:scale-125 transition-transform duration-300"
            onError={() => setImgSrc("/img/slide-bg-five.jpg")}
          />
        </div>

        <div
          className={`text-customGray m-0 md:ml-5 md:text-left text-center w-full `}
        >
          <div className="relative group">
            <p
              className={`text-xs   opacity-70 font-bold sm:mb-1 line-clamp-1`}
            >
              {item.subcategories}
            </p>
            <p
              className={`absolute text-xs right-0 top-full mt-1 hidden w-max max-w-xs bg-customGray text-white lg:text-[8px] md:text-[16px] sm:text-2xl 
              rounded-md p-2 shadow-lg group-hover:block`}
            >
              {item.category}
            </p>
          </div>

          <div className=" ">
            <div className=" ">
              {props.isProtein ? (
                <p className="text-xs font-bold sm:mb-1">
                  RM <span className="text-xs">{item.pricePerGram}</span>
                </p>
              ) : props.isCarb ? (
                <p className="text-xs font-bold sm:mb-1">
                  RM <span className="text-xs">{item.pricePerGram}</span>
                </p>
              ) : (
                <p className={`text-xs font-bold sm:mb-1`}>
                  RM <span className="text-xs">{item.price}</span>
                </p>
              )}
            </div>
            <div className="">
              {props.isProtein ? (
                <p className="text-xs font-bold sm:mb-1">
                  PROTEIN: <span className="text-xs">{item.protein}G</span>
                </p>
              ) : props.isCarb ? (
                <p className="text-xs font-bold sm:mb-1">
                  Carb: <span className="text-xs">{item.carbs}G</span>
                </p>
              ) : (
                <p className={` text-xs font-bold sm:mb-1`}>
                  CALORIES:
                  <span className="text-xs">{item.totalCalories}</span>
                </p>
              )}
            </div>
          </div>

          {props.setOnAddToCart && (
            <button
              className="relative mt-5 w-[80%] inline-flex items-center justify-center p-2 overflow-hidden text-white transition duration-300 ease-out bg-green-600 rounded-lg shadow-md group hover:bg-green-700 focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
              onClick={() => addToCart(item)}
            >
              <span className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-700 opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out"></span>
              <span className="relative text-xs z-10 font-semibold tracking-wide">
                SELECT
              </span>
            </button>
          )}
        </div>
      </div>

      {!props.isProtein && !props.isCarb && (
        <h6
          className={`md:text-left text-center w-full ${
            colorInverse
              ? "text-customGreen hover:text-customOrange"
              : "text-customOrange hover:text-customGreen"
          } text-lg sm:text-xl md:text-xl lg:text-[1.25vw] font-semibold italic items-center line-clamp-1`}
        >
          {item.menuName}
        </h6>
      )}

      {isSelected && (
        <>
          <div className="absolute top-0 left-0 bg-black opacity-50 rounded-lg inset-0"></div>
          <div className="absolute top-1 right-2 px-3 py-1 bg-white rounded-[50%] font-extrabold">
            {index || 1}
          </div>
        </>
      )}
    </div>
  );
};

export default MenuBox;
