"use client";

import SimpleMenuListBox from "@/app/components/SimpleMenuListBox";
import SuggestionMenuListForCustom from "@/app/components/SuggestionMenuListForCustom";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { useState, useEffect } from "react";
// import {CrossIcon} from "@/app/components/Icons";
// import Image from "next/image";
import AddToCartModal from "@/app/components/AddToCartModal";
import { useAtom } from "jotai";
import { cartAtom } from "@/app/store/menuQuantityStore";
import SuggestionMenuList from "@/app/components/SuggetionMenuList";

const bgImage = [
  "/img/slide-bg-one.jpg",
  "/img/slide-bg-two.jpg",
  "/img/slide-bg-three.jpg",
  "/img/slide-bg-four.jpg",
  "/img/slide-bg-five.jpg",
];

const CustomMenu = () => {
  const [desiredCalories, setDesiredCalories] = useState<number>(0);
  // const [selectedCalories] = useState<number>(0);
  const [selectedCalories, setSelectedCalories] = useState<number>(0);
  const [remainingCalories, setRemainingCalories] = useState<number>(0);
  const [showCaloriesModal, setShowCaloriesModal] = useState(false);
  const [showProteinModal, setShowProteinModal] = useState(false);
  const [isDesiredCaloriesPage, setIsDesiredCaloriesPage] = useState(true);
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay()]);
  const [showAddToCartModal, setShowAddToCartModal] = useState<boolean>(false);
  const [cart, setCart] = useAtom(cartAtom);
  const [suggestionProteinMenu, setSuggestionProteinMenu] = useState([]);
  const [suggestionCarbMenu, setSuggestionCarbMenu] = useState([]);
  const [allProteinMenus, setAllProteinMenu] = useState([]);
  const [allCarbsMenus, setAllCarbsMenu] = useState([]);
  const [caloriesError, SetCaloriesError] = useState(false);
  // console.log("True Desired Calories Page", showAddToCartModal);
  //protein and carbs
  // protein
  const [desiredProtein, setDesiredProtein] = useState<number>(0);
  const [selectedProtein, setSelectedProtein] = useState<number>(0);
  // const [remainingProtein, setRemainingProtein] = useState<number>(0);

  // carbs
  const [desiredCarb, setDesiredCarb] = useState<number>(0);
  const [selectedCarb, setSelectedCarb] = useState<number>(0);

  const [isProtein, setIsProtein] = useState(true);
  const [isCarb, setIsCarb] = useState(true);

  useEffect(() => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;

    cart.forEach((item) => {
      const quantity = item.quantity;
      const menu = item.menu;

      if (menu.subcategories === "Protein") {
        totalProtein += quantity * (menu.protein || 0);
      } else if (menu.subcategories === "Carbs") {
        totalCarbs += quantity * (menu.carbs || 0);
      } else {
        totalCalories += quantity * (menu.totalCalories || 0);
      }
    });

    // Round the values to 2 decimal places
    totalCalories = parseFloat(totalCalories.toFixed(2));
    totalProtein = parseFloat(totalProtein.toFixed(2));
    totalCarbs = parseFloat(totalCarbs.toFixed(2));

    setSelectedCalories(totalCalories);
    setSelectedProtein(totalProtein);
    setSelectedCarb(totalCarbs);
  }, [cart]);

  const [desiredCaloriesMenu, setDesiredCaloriesMenu] = useState([]);
  const onSubmitCalories = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log("Desired Calories", desiredCalories, typeof desiredCalories);
    if (desiredCalories < 250 || desiredCalories > 10000) {
      SetCaloriesError(true);
      return;
    }
    setShowCaloriesModal(true);

    //recommend menus for desired calories
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
      .then((data) => {
        setDesiredCaloriesMenu(data);
      })
      .catch((error) => {
        console.error("Error fetching menus:", error);
      });
  };

  //set show warning modal
  const [showWarningModal, setShowWarningModal] = useState(false);
  const resetButton = () => {
    setSelectedCalories(0);
    setSelectedProtein(0);
    setSelectedCarb(0);
    setCart([]);
  };

  useEffect(() => {
    setRemainingCalories(Number(desiredCalories) - Number(selectedCalories));
    if (selectedCalories - 50 > desiredCalories) {
      setShowWarningModal(true);
    } else {
      setShowWarningModal(false);
    }
  }, [selectedCalories, desiredCalories]);

  // Get Standard Menus and Macro Menus
  const [getStandardMenus, setStandardMenus] = useState([]);
  const [getMacroMenus, setMicroMenus] = useState([]);
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
      .then((data) => {
        const standard = data.filter(
          (item: any) => item.category === "standard"
        );
        const micro = data.filter((item: any) => item.category === "macro");

        setStandardMenus(standard);
        setMicroMenus(micro);
      })
      .catch((error) => {
        console.error("Error fetching menus:", error);
      });
  }, []);

  const onSubmitProtein = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowProteinModal(true);

    // Recommend menu for desired protein
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
      .then((data) => {
        setDesiredCaloriesMenu(data);
        const proteinMenus = data.filter(
          (item: any) => item.subcategories === "Protein"
        );
        setSuggestionProteinMenu(proteinMenus);
      })
      .catch((error) => {
        console.error("Error fetching menus:", error);
      });

    // Recommend menu for desired carbs
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
      .then((data) => {
        setDesiredCaloriesMenu(data);
        const carbMenus = data.filter(
          (item: any) => item.subcategories === "Carbs"
        );

        setSuggestionCarbMenu(carbMenus);
      })
      .catch((error) => {
        console.error("Error fetching menus:", error);
      });

    //==========
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
      .then((data) => {
        const allProteinMenu = data.filter(
          (item: any) =>
            item.category === "macro" && item.subcategories === "Protein"
        );
        const allCarbsMenu = data.filter(
          (item: any) =>
            item.category === "macro" && item.subcategories === "Carbs"
        );
        setAllProteinMenu(allProteinMenu);
        setAllCarbsMenu(allCarbsMenu);
      })
      .catch((error) => {
        console.error("Error fetching menus:", error);
      });
  };

  const onClickDesiredCalories = () => {
    setShowCaloriesModal(false);
    setIsDesiredCaloriesPage(true);
  };

  const onClickDesiredProtein = () => {
    setShowCaloriesModal(false);
    setIsDesiredCaloriesPage(false);
    setShowProteinModal(false);
  };

  const [isMobile, setIsMobile] = useState(false);

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
        {isDesiredCaloriesPage && showCaloriesModal && (
          <div className="w-full flex flex-col items-center lg:items-start lg:px-2 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {/* Card 1: Desired Calories */}
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

              {/* Card 2: Selected Calories */}
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

              {/* Card 3: Remaining Calories */}
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

        {isDesiredCaloriesPage ? (
          showCaloriesModal ? (
            <div className="w-full bg-white flex flex-col">
              <div className=" w-full p-2 pb-1">
                <div className="border-2 border-customOrange rounded-md h-full bg-customBeige px-4 py-2">
                  <div className="relative">
                    <h5 className="text-customOrange text-sm font-bold mb-2">
                      RECOMMEND MENU FOR {desiredCalories} KCAL
                    </h5>
                    {/* <SuggestionMenuList items={desiredCaloriesMenu} setShowAddToCart={setShowAddToCartModal} /> */}
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
                  {/* <div className="relative mt-4">
                    <h5 className="text-transparent text-base font-bold mb-2">MACRO MENU</h5>
                    <SimpleMenuListBox items={getMacroMenus} row={1} col={3} setShowAddToCart={setShowAddToCartModal} />
                  </div> */}
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-screen relative overflow-hidden">
              {/* Background Slider */}
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
                    isProtein={isProtein}
                  />
                </div>
              </div>
            </div>
            <div className="w-full p-2 pt-1 h-72">
              <div
                className={`border-2 overflow-hidden ${
                  isProtein ? "border-customOrange" : "border-customGreen"
                } rounded-md h-full bg-customBeige flex-col p-2`}
              >
                <div className="relative mb-1">
                  <h5
                    className={`${
                      isProtein ? "text-customOrange" : "text-customGreen"
                    } text-base font-bold mb-2`}
                  >
                    OUR PROTEIN MENU
                  </h5>
                  <SimpleMenuListBox
                    items={allProteinMenus}
                    isProtein={isProtein}
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
                    isCarb={isCarb}
                  />
                </div>
              </div>
            </div>
            <div className="w-full p-2 pt-1 h-72">
              <div
                className={`border-2 overflow-hidden border-customGreen rounded-md h-full bg-customBeige flex-col p-2`}
              >
                <div className="relative mb-1">
                  <h5 className={`text-customGreen text-base font-bold mb-2`}>
                    OUR CARB MENU
                  </h5>
                  <SimpleMenuListBox
                    items={allCarbsMenus}
                    isCarb={isCarb}
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
      {/* it is warning about a calories more starts */}
      {/* {showWarningModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-[300px] text-center">
            <h2 className="text-lg font-bold text-customOrange mb-4">
              Warning!!!
            </h2>
            <p className="text-sm text-gray-700">
              Your selected calories have exceeded the desired amount.
            </p>
            <button
              onClick={() => setShowWarningModal(false)}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )} */}

      {/* {showProteinWarningModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-[300px] text-center">
            <h2 className="text-lg font-bold text-customOrange mb-4">Warning!!!</h2>
            <p className="text-sm text-gray-700">Your selected protein have exceeded the desired amount.</p>
            <button
              onClick={() => setShowProteinWarningModal(false)}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )} */}
      {/* it is warning about a calories more ends */}
      {showAddToCartModal && (
        <AddToCartModal setAddToCartModal={setShowAddToCartModal} />
      )}
    </div>
  );
};

export default CustomMenu;
