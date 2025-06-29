"use client";

import SimpleMenuListBox from "@/app/components/SimpleMenuListBox";
import SuggestionMenuListForCustom from "@/app/components/SuggestionMenuListForCustom";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { useState, useEffect } from "react";
import AddToCartModal from "@/app/components/AddToCartModal";
import { useAtom } from "jotai";
import { cartAtom } from "@/app/store/menuQuantityStore";

interface MenuItem {
  id: number;
  name: string;
  totalCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: string;
  image: string;
  price: number;
  plan: string;
  pricePerGram: number;
  subcategories: string;
  weekNumber: number;
  menuName: string;
  [key: string]: string | number | unknown;
}

// interface CartItem {
//   menu: MenuItem;
//   quantity: number;
// }

const bgImage = [
  "/img/slide-bg-one.jpg",
  "/img/slide-bg-two.jpg",
  "/img/slide-bg-three.jpg",
  "/img/slide-bg-four.jpg",
  "/img/slide-bg-five.jpg",
];

const CustomMenu = () => {
  const [desiredCalories, setDesiredCalories] = useState<number>(0);
  const [selectedCalories, setSelectedCalories] = useState<number>(0);
  const [remainingCalories, setRemainingCalories] = useState<number>(0);
  const [showCaloriesModal, setShowCaloriesModal] = useState(false);
  const [showProteinModal, setShowProteinModal] = useState(false);
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay()]);
  const [showAddToCartModal, setShowAddToCartModal] = useState<boolean>(false);
  const [cart, setCart] = useAtom(cartAtom);
  const [suggestionProteinMenu, setSuggestionProteinMenu] = useState<
    MenuItem[]
  >([]);
  const [suggestionCarbMenu, setSuggestionCarbMenu] = useState<MenuItem[]>([]);
  const [allProteinMenus, setAllProteinMenu] = useState<MenuItem[]>([]);
  const [allCarbsMenus, setAllCarbsMenu] = useState<MenuItem[]>([]);
  const [caloriesError, setCaloriesError] = useState(false);
  const [desiredProtein, setDesiredProtein] = useState<number>(0);
  const [desiredCarb, setDesiredCarb] = useState<number>(0);
  const [desiredCaloriesMenu, setDesiredCaloriesMenu] = useState<MenuItem[]>(
    []
  );
  const [getStandardMenus, setStandardMenus] = useState<MenuItem[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    let totalCalories = 0;

    cart.forEach((item) => {
      const quantity = item.quantity;
      const menu = item.menu;

      if (menu.subcategories === "Protein") {
        // Calculate protein if needed later
      } else if (menu.subcategories === "Carbs") {
        // Calculate carbs if needed later
      } else {
        totalCalories += quantity * (menu.totalCalories || 0);
      }
    });

    setSelectedCalories(parseFloat(totalCalories.toFixed(2)));
  }, [cart]);

  useEffect(() => {
    setRemainingCalories(Number(desiredCalories) - Number(selectedCalories));
  }, [selectedCalories, desiredCalories]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BITESBYTE_API_URL}/getavailablemenus`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: MenuItem[]) => {
        const standard = data.filter((item) => item.category === "standard");
        setStandardMenus(standard);
      })
      .catch((error) => {
        console.error("Error fetching menus:", error);
      });
  }, []);

  const onSubmitCalories = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (desiredCalories < 250 || desiredCalories > 10000) {
      setCaloriesError(true);
      return;
    }
    setShowCaloriesModal(true);

    fetch(
      `${process.env.NEXT_PUBLIC_BITESBYTE_API_URL}/getRecommendedMenuByCalorie`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(desiredCalories),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: MenuItem[]) => {
        setDesiredCaloriesMenu(data);
      })
      .catch((error) => {
        console.error("Error fetching menus:", error);
      });
  };

  const resetButton = () => {
    setSelectedCalories(0);
    setCart([]);
  };

  const onSubmitProtein = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowProteinModal(true);

    fetch(
      `${process.env.NEXT_PUBLIC_BITESBYTE_API_URL}/getRecommendedMenuByProtein?protein=${desiredProtein}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: MenuItem[]) => {
        setDesiredCaloriesMenu(data);
        const proteinMenus = data.filter(
          (item) => item.subcategories === "Protein"
        );
        setSuggestionProteinMenu(proteinMenus);
      })
      .catch((error) => {
        console.error("Error fetching menus:", error);
      });

    fetch(
      `${process.env.NEXT_PUBLIC_BITESBYTE_API_URL}/getRecommendedMenuByCarbs?carbs=${desiredCarb}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: MenuItem[]) => {
        setDesiredCaloriesMenu(data);
        const carbMenus = data.filter((item) => item.subcategories === "Carbs");
        setSuggestionCarbMenu(carbMenus);
      })
      .catch((error) => {
        console.error("Error fetching menus:", error);
      });

    fetch(`${process.env.NEXT_PUBLIC_BITESBYTE_API_URL}/getavailablemenus`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: MenuItem[]) => {
        const allProteinMenu = data.filter(
          (item) =>
            item.category === "macro" && item.subcategories === "Protein"
        );
        const allCarbsMenu = data.filter(
          (item) => item.category === "macro" && item.subcategories === "Carbs"
        );
        setAllProteinMenu(allProteinMenu);
        setAllCarbsMenu(allCarbsMenu);
      })
      .catch((error) => {
        console.error("Error fetching menus:", error);
      });
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bg-customBeige text-customGray">
      <div className=" h-[calc(100vh-111px)]">
        {showCaloriesModal && (
          <div className="w-full flex flex-col items-center lg:items-start lg:px-2 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              <div className="border-2 justify-center border-customGreen rounded-lg bg-white p-4 flex flex-col items-center">
                <h4 className="text-sm font-bold text-customGray mb-1">
                  DESIRED CALORIES
                </h4>
                <span className="text-4xl font-bold text-customGray">
                  {desiredCalories}
                </span>
                <span className="text-sm font-bold text-customGray opacity-50">
                  KCAL
                </span>
              </div>

              <div className="border-2 justify-center border-customGreen rounded-lg bg-white p-4 flex flex-col items-center">
                <h4 className="text-sm font-bold text-customGray mb-1">
                  SELECTED CALORIES
                </h4>
                <span
                  className={`text-4xl font-bold ${
                    selectedCalories > desiredCalories
                      ? "text-red-500"
                      : "text-customGray"
                  }`}
                >
                  {selectedCalories}
                </span>
                <span className="text-sm font-bold text-customGray opacity-50">
                  KCAL
                </span>

                <span
                  className="mt-4 px-4 py-2 cursor-pointer bg-customGreen text-white rounded"
                  onClick={resetButton}
                >
                  reset
                </span>
              </div>

              <div className="border-2 justify-center border-customGreen rounded-lg bg-white p-4 flex flex-col items-center">
                <h4 className="text-sm font-bold text-customGray mb-1">
                  REMAINING CALORIES
                </h4>
                <span className="text-4xl font-bold text-customGray">
                  {selectedCalories > desiredCalories
                    ? "0"
                    : Number.isInteger(remainingCalories)
                    ? remainingCalories
                    : remainingCalories.toFixed(1)}
                </span>
                <span className="text-sm font-bold text-customGray opacity-50">
                  KCAL
                </span>
              </div>
            </div>
          </div>
        )}

        {!showProteinModal ? (
          showCaloriesModal ? (
            <div className="w-full bg-white flex flex-col">
              <div className=" w-full p-2 pb-1">
                <div className="border-2 border-customOrange rounded-md h-full bg-customBeige px-4 py-2">
                  <div className="relative">
                    <h5 className="text-customOrange text-sm font-bold mb-2">
                      RECOMMEND MENU FOR {desiredCalories} KCAL
                    </h5>
                    <SuggestionMenuListForCustom
                      items={desiredCaloriesMenu}
                      setShowAddToCart={setShowAddToCartModal}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full  p-2 pt-1">
                <div className="border-2 border-customGreen rounded-md h-full bg-customBeige flex-col p-2">
                  <div className="relative mb-1">
                    <h5 className="text-customGreen text-base font-bold mb-2">
                      OUR MENU
                    </h5>
                    <SimpleMenuListBox
                      items={getStandardMenus}
                      row={isMobile ? 1 : 3}
                      col={isMobile ? 1 : 3}
                      setShowAddToCart={setShowAddToCartModal}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-screen relative overflow-hidden">
              <div className="absolute inset-0 h-full" ref={emblaRef}>
                <div className="flex h-full">
                  {bgImage.map((image, index) => (
                    <div
                      key={index}
                      className="min-w-full h-full bg-cover bg-center "
                      style={{ backgroundImage: `url(${image})` }}
                    />
                  ))}
                </div>
              </div>
              <div className="absolute inset-0 bg-black/60">
                <form
                  onSubmit={onSubmitCalories}
                  className="my-10 mx-auto lg:w-2/5 md:w-4/5 sm:w-4/5"
                >
                  <div className=" flex flex-col items-center justify-between h-[200px] p-4 bg-customBeige border-2 border-customOrange rounded-md">
                    <h2 className="font-bold lg:text-lg md:text-sm sm:text-sm text-sm">
                      PLEASE ENTER DESIRED CALORIES
                    </h2>
                    <div className="flex flex-col w-full">
                      <p className="text-[10px] sm:text-[10px] md:text-xs lg:text-smtext-center">
                        WE WILL USE THIS VALUE TO PROVIED MENUS BASED ON YOUR
                        DESIRED CALORIES SUBMITTED.
                      </p>
                      <input
                        type="number"
                        className="border-2 border-customOrange w-full p-2 rounded-lg"
                        onChange={(e) =>
                          setDesiredCalories(
                            e.target.value ? parseInt(e.target.value) : 0
                          )
                        }
                      />
                      {caloriesError && (
                        <p className="text-xs text-red-500">
                          Please Enter a value between 250 and 10000 calories.
                        </p>
                      )}
                    </div>
                    <div className="flex w-full justify-center ">
                      <input
                        type="button"
                        className="bg-customGray font-bold text-white opacity-50 px-2 py-1 rounded mr-5 cursor-pointer"
                        value="CANCEL"
                      />
                      <input
                        type="submit"
                        className="bg-customGreen font-bold text-white px-2 py-1 rounded cursor-pointer"
                        value="SUBMIT"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )
        ) : showProteinModal ? (
          <div className="w-[75%] bg-white flex flex-col">
            <div className=" w-full p-2 pb-1 h-64">
              <div className="border-2 border-customOrange rounded-md h-full bg-customBeige px-4 py-2">
                <div className="relative">
                  <h5 className="text-customOrange text-sm font-bold mb-2">
                    RECOMMEND MENU FOR {desiredProtein}G PROTEIN
                  </h5>
                  <SuggestionMenuListForCustom
                    items={suggestionProteinMenu}
                    setShowAddToCart={setShowAddToCartModal}
                  />
                </div>
              </div>
            </div>
            <div className="w-full p-2 pt-1 h-72">
              <div className="border-2 border-customOrange rounded-md h-full bg-customBeige flex-col p-2">
                <div className="relative mb-1">
                  <h5 className="text-customOrange text-base font-bold mb-2">
                    OUR PROTEIN MENU
                  </h5>
                  <SimpleMenuListBox
                    items={allProteinMenus}
                    row={isMobile ? 1 : 3}
                    col={isMobile ? 1 : 3}
                    setShowAddToCart={setShowAddToCartModal}
                  />
                </div>
              </div>
            </div>
            <div className=" w-full p-2 pb-1 h-64">
              <div className="border-2 border-customGreen rounded-md h-full bg-customBeige px-4 py-2">
                <div className="relative ">
                  <h5 className="text-customGreen text-sm font-bold mb-2">
                    RECOMMEND MENU FOR {desiredCarb}G CARB
                  </h5>
                  <SuggestionMenuListForCustom
                    items={suggestionCarbMenu}
                    setShowAddToCart={setShowAddToCartModal}
                  />
                </div>
              </div>
            </div>
            <div className="w-full p-2 pt-1 h-72">
              <div className="border-2 border-customGreen rounded-md h-full bg-customBeige flex-col p-2">
                <div className="relative mb-1">
                  <h5 className="text-customGreen text-base font-bold mb-2">
                    OUR CARB MENU
                  </h5>
                  <SimpleMenuListBox
                    items={allCarbsMenus}
                    row={isMobile ? 1 : 3}
                    col={isMobile ? 1 : 3}
                    setShowAddToCart={setShowAddToCartModal}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-[75%]  h-screen relative overflow-hidden">
            <div className="absolute inset-0 h-full" ref={emblaRef}>
              <div className="flex h-full">
                {bgImage.map((image, index) => (
                  <div
                    key={index}
                    className="min-w-full h-full bg-cover bg-center "
                    style={{ backgroundImage: `url(${image})` }}
                  ></div>
                ))}
              </div>
            </div>
            <div className="absolute inset-0 bg-black/60">
              <form onSubmit={onSubmitProtein} className="my-10 mx-auto w-2/3">
                <div className=" flex flex-col items-center justify-between h-[300px] p-4 bg-customBeige border-2 border-customOrange rounded-md">
                  <h2 className="font-bold text-lg ">
                    PLEASE ENTER DESIRED PROTEIN AND CARBS
                  </h2>
                  <div className="flex flex-col w-full">
                    <p className="text-xs pb-2">
                      WE WILL USE THIS VALUE TO PROVIED MENUS BASED ON YOUR
                      DESIRED PROTEIN AND CARBS SUBMITTED.
                    </p>
                    <div className="mb-3">
                      <label className="text-customOrange text-xs">
                        ENTER PROTEIN
                      </label>
                      <input
                        type="number"
                        className="border-2 border-customOrange w-full p-2 rounded-lg"
                        onChange={(e) =>
                          setDesiredProtein(
                            e.target.value ? parseInt(e.target.value) : 0
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="text-customOrange text-xs">
                        ENTER CARBS
                      </label>
                      <input
                        type="number"
                        className="border-2 border-customOrange w-full p-2 rounded-lg"
                        onChange={(e) =>
                          setDesiredCarb(
                            e.target.value ? parseInt(e.target.value) : 0
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end w-full ">
                    <input
                      type="button"
                      className="bg-customGray font-bold text-white opacity-50 px-2 py-1 rounded mr-5 cursor-pointer"
                      value="CANCEL"
                    />
                    <input
                      type="submit"
                      className="bg-customGreen font-bold text-white px-2 py-1 rounded cursor-pointer"
                      value="SUBMIT"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      {showAddToCartModal && (
        <AddToCartModal setAddToCartModal={setShowAddToCartModal} />
      )}
    </div>
  );
};

export default CustomMenu;
