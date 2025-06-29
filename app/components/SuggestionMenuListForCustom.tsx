import useEmblaCarousel from "embla-carousel-react";
import { SimpleMenuType } from "../type/SimpleMenuType";
import { useState, useEffect } from "react";
import { chunkArray } from "../utils/menuCardChunk";
import MenuBox from "./MenuBox";
import { useAtom } from "jotai";
import { cartAtom } from "../store/menuQuantityStore";

type Props = {
  items: SimpleMenuType[];
  setShowAddToCart: (b: boolean) => void;
  isProtein?: boolean;
  isCarb?: boolean;
};

const SuggestionMenuListForCustom = (props: Props) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    startIndex: 0,
    axis: "x",
  });
  const [cart, setCart] = useAtom(cartAtom);

  const [menuList, setMenuList] = useState<SimpleMenuType[][]>([]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let chunkSize = 2; // desktop default

      if (width < 640) {
        chunkSize = 1; // mobile
      } else if (width < 1024) {
        chunkSize = 2; // tablet
      }

      const chunked = chunkArray(props.items, chunkSize);
      setMenuList(chunked);
    };

    handleResize(); // run on mount
    window.addEventListener("resize", handleResize); // update on resize
    return () => window.removeEventListener("resize", handleResize);
  }, [props.items]);

  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      const updatedCart = [...cart];

      props.items.forEach((menu) => {
        const quantity = 1;
        const existingIndex = updatedCart.findIndex(
          (item) => item.menuName === menu.menuName
        );

        if (existingIndex !== -1) {
          updatedCart[existingIndex].quantity += quantity;
        } else {
          updatedCart.push({
            quantity,
            menu,
            menuName: menu.menuName,
          });
        }
      });

      setCart(updatedCart);
    } else {
      const filteredCart = cart.filter(
        (cartItem) =>
          !props.items.some((item) => item.menuName === cartItem.menuName)
      );
      setCart(filteredCart);
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-end items-center">
        <label
          className="absolute  flex items-center space-x-2 py-2"
          style={{ top: "-35px" }}
        >
          <input
            type="checkbox"
            className="accent-green-500 w-5 h-5"
            onChange={handleSelectAll}
          />
          <span className="text-gray-500 opacity-50 font-bold text-sm">
            SELECT ALL
          </span>
        </label>
      </div>

      <div className="overflow-hidden w-[94%] m-auto" ref={emblaRef}>
        <div className={`flex w-full ${!props.isProtein ? "h-full" : ""}`}>
          {menuList &&
            menuList.map((items: SimpleMenuType[], index: number) => {
              return (
                <div
                  key={index}
                  className="flex-none w-full flex items-center justify-center sm:justify-start h-[100vh] sm:h-auto"
                >
                  {items.map((item: SimpleMenuType) => {
                    const isSelected = cart.some(
                      (cartItem) => cartItem.menuName === item.menuName
                    );
                    const cartIndex =
                      cart.findIndex(
                        (cartItem) => cartItem.menuName === item.menuName
                      ) + 1;

                    return (
                      <div
                        key={item.id}
                        className={`w-full sm:w-1/2  px-2 flex justify-center items-center ${
                          props.isProtein ? "sm:max-h-[180px]" : ""
                        } h-[100vh] sm:h-auto`}
                      >
                        <MenuBox
                          isProtein={props.isProtein}
                          isCarb={props.isCarb}
                          isSuggestion={true}
                          item={item}
                          colorInverse={true}
                          setOnAddToCart={props.setShowAddToCart}
                          key={item.id}
                          isSelected={isSelected}
                          index={cartIndex}
                        />
                      </div>
                    );
                  })}
                </div>
              );
            })}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        className="absolute top-[50%] left-0 transform -translate-y-1/2 z-10 w-7 rounded-md border-[2px] border-customGray opacity-50 hover:bg-customGray"
      >
        <svg
          className="p-[6px] fill-customGrey hover:fill-customBeige"
          viewBox="0 0 532 532"
        >
          <path d="M355.66 11.354c13.793-13.805 36.208-13.805 50.001 0 13.785 13.804 13.785 36.238 0 50.034L201.22 266l204.442 204.61c13.785 13.805 13.785 36.239 0 50.044-13.793 13.796-36.208 13.796-50.002 0a5994246.277 5994246.277 0 0 0-229.332-229.454 35.065 35.065 0 0 1-10.326-25.126c0-9.2 3.393-18.26 10.326-25.2C172.192 194.973 332.731 34.31 355.66 11.354Z" />
        </svg>
      </button>

      <button
        onClick={scrollNext}
        className="absolute top-[50%] right-0 transform -translate-y-1/2 z-10 w-7 rounded-md border-[2px] border-customGray opacity-50 hover:bg-customGray"
      >
        <svg
          className="p-[6px] fill-customGrey hover:fill-customBeige"
          viewBox="0 0 532 532"
        >
          <path d="M176.34 520.646c-13.793 13.805-36.208 13.805-50.001 0-13.785-13.804-13.785-36.238 0-50.034L330.78 266 126.34 61.391c-13.785-13.805-13.785-36.239 0-50.044 13.793-13.796 36.208-13.796 50.002 0 22.928 22.947 206.395 206.507 229.332 229.454a35.065 35.065 0 0 1 10.326 25.126c0 9.2-3.393 18.26-10.326 25.2-45.865 45.901-206.404 206.564-229.332 229.52Z" />
        </svg>
      </button>
    </div>
  );
};

export default SuggestionMenuListForCustom;
