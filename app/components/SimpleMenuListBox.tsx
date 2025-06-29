import { SimpleMenuType } from "../type/SimpleMenuType";
import useEmblaCarousel from "embla-carousel-react";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import MenuBox from "./MenuBox";
import { chunkArray } from "../utils/menuCardChunk";
import { useAtom } from "jotai";
import { cartAtom } from "../store/menuQuantityStore";

type Props = {
  items: SimpleMenuType[];
  row: number;
  col: number;
  setShowAddToCart: Dispatch<SetStateAction<boolean>>;
  isProtein?: boolean;
  isCarb?: boolean;
  page?: string;
};

const SimpleMenuListBox = (props: Props) => {
  const [isMobile, setIsMobile] = useState(false);
  const [height, setHeight] = useState<number | null>(190 * props.row);
  const [filter, setFilter] = useState<string>("ALL");
  const [menuList, setMenuList] = useState<SimpleMenuType[][]>([]);
  const [cart] = useAtom(cartAtom);

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      setHeight(width < 768 ? null : 190 * props.row);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [props.row]);

  useEffect(() => {
    setMenuList(chunkArray(props.items, props.col * props.row));
  }, [props.items, props.row, props.col]);

  const normalize = (str: string) =>
    str.replace(/[’‘]/g, "'").toLowerCase().trim();

  const onFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = normalize(e.target.value);
    setFilter(e.target.value);

    const filtered =
      value === "all"
        ? props.items
        : props.items.filter((item: SimpleMenuType) => {
            const subs =
              item.subcategories?.split(",").map((sub) => normalize(sub)) || [];
            return subs.includes(value);
          });

    setMenuList(chunkArray(filtered, props.row * props.col));
  };

  const [emblaRef, emblaApi] = useEmblaCarousel(
    isMobile
      ? { dragFree: true, skipSnaps: true }
      : {
          axis: "x",
          loop: false,
          align: "start",
          containScroll: "trimSnaps",
        }
  );

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <div className="relative">
      <div
        className="overflow-hidden"
        ref={!isMobile ? emblaRef : undefined}
        style={{ height: height === null ? "auto" : `${height}px` }}
      >
        <div
          className={`flex ${isMobile ? "flex-col" : "flex-row"} gap-2`}
          style={{ height: height === null ? "auto" : `${height}px` }}
        >
          {menuList.map((items: SimpleMenuType[], index: number) => (
            <div
              key={index}
              className="grid grid-cols-3 grid-rows-3 gap-2 min-w-full"
            >
              {items.map((item) => (
                <div key={item.id} className="  p-1">
                  <MenuBox
                    item={item}
                    isProtein={props.isProtein}
                    isCarb={props.isCarb}
                    colorInverse={false}
                    setOnAddToCart={props.setShowAddToCart}
                    isSelected={cart.some(
                      (cartItem) => cartItem.menuName === item.menuName
                    )}
                    index={
                      cart.findIndex(
                        (cartItem) => cartItem.menuName === item.menuName
                      ) + 1
                    }
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Filter dropdown */}
      {!props.isProtein && !props.isCarb && (
        <select
          value={filter}
          onChange={onFilter}
          className={` absolute -top-5
           ${props.page === "simple" ? "right-0" : "right-28 "}
          
          -translate-y-1/2 transform z-10 w-32 rounded-md border-[2px] border-customGray opacity-50 text-xs text-black p-1`}
        >
          <option value="ALL">ALL</option>
          <option value="Protein Surplus">PROTEIN SURPLUS</option>
          <option value="Chef's Choice">CHEF&#39;S CHOICE</option>
          <option value="Lean Mass">LEAN MASS</option>
          <option value="Salad">SALAD</option>
          <option value="Caloric Deficit">CALORIC DEFICIT</option>
          <option value="Maintenance">MAINTENANCE</option>
          <option value="Carbs">CARBS</option>
        </select>
      )}

      {/* Scroll buttons */}
      {!isMobile && (
        <>
          <button
            onClick={scrollNext}
            className={`absolute rotate-90 z-10 ${
              props.page === "simple"
                ? "top-1/2 -right-10"
                : "  -top-5 right-0 "
            } w-7 rounded-md transform -translate-y-1/2 border-[2px] border-customGray opacity-50 hover:bg-customGray`}
          >
            <svg
              className="p-[6px] fill-customGrey hover:fill-customBeige"
              viewBox="0 0 532 532"
            >
              <path d="M520.646 355.66c13.805 13.793 13.805 36.208 0 50.001-13.804 13.785-36.238 13.785-50.034 0L266 201.22 61.391 405.66c-13.805 13.785-36.239 13.785-50.044 0-13.796-13.793-13.796-36.208 0-50.002 22.947-22.928 206.507-206.395 229.454-229.332a35.065 35.065 0 0 1 25.126-10.326c9.2 0 18.26 3.393 25.2 10.326 45.901 45.865 206.564 206.404 229.52 229.332Z" />
            </svg>
          </button>

          {/* left Button */}
          <button
            onClick={scrollPrev}
            className={`absolute rotate-90 z-10 ${
              props.page === "simple"
                ? "top-1/2 -left-10 "
                : "  -top-5 right-12 "
            } w-7 rounded-md transform -translate-y-1/2 border-[2px] border-customGray opacity-50 hover:bg-customGray`}
          >
            <svg
              className="p-[6px] fill-customGrey hover:fill-customBeige"
              viewBox="0 0 532 532"
            >
              <path d="M11.354 176.34c-13.805-13.793-13.805-36.208 0-50.001 13.804-13.785 36.238-13.785 50.034 0L266 330.78l204.61-204.442c13.805-13.785 36.239-13.785 50.044 0 13.796 13.793 13.796 36.208 0 50.002a5994246.277 5994246.277 0 0 0-229.454 229.332 35.065 35.065 0 0 1-25.126 10.326c-9.2 0-18.26-3.393-25.2-10.326C194.973 359.808 34.31 199.269 11.354 176.34Z" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
};

export default SimpleMenuListBox;
