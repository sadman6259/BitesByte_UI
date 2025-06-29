import useEmblaCarousel from "embla-carousel-react";
import { SimpleMenuType } from "../type/SimpleMenuType";
import { Dispatch, SetStateAction, useState } from "react";
import { chunkArray } from "../utils/menuCardChunk";
import MenuBox from "./MenuBox";
import { useAtom } from "jotai";
// import { cartAtom } from "@/app/store/menuQuantityStore";
import { cartAtom } from "../store/menuQuantityStore";

type Props = {
  items: SimpleMenuType[];
  setShowAddToCart: Dispatch<SetStateAction<boolean>>;
};

const SuggestionMenuList = (props: Props) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    startIndex: 0,
    axis: "x",
  });
  const [menuList] = useState(chunkArray(props.items, 4));
  const [cart, setCart] = useAtom(cartAtom);

  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  return (
    <div className="relative">
      <div className="overflow-hidden w-[94%] m-auto" ref={emblaRef}>
        <div className="flex max-h-[183px] w-full">
          {menuList &&
            menuList.map((items: SimpleMenuType[], index: number) => {
              return (
                <div
                  key={index}
                  className="flex-none w-full flex items-center text-customOrange justify-around sm:justify-start"
                >
                  {items.map((item: SimpleMenuType) => {
                    const isSelected = cart.some(
                      (cartItem) => cartItem.menuName === item.menuName
                    );
                    return (
                      <div
                        key={item.id}
                        className="w-[182px] sm:w-1/4 p-1 h-[183px] max-h-[183px]"
                      >
                        <MenuBox
                          item={item}
                          colorInverse={true}
                          key={item.id}
                          setOnAddToCart={props.setShowAddToCart}
                          isSelected={isSelected}
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

export default SuggestionMenuList;
