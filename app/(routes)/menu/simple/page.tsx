"use client";
import { useState, useEffect } from "react";
import SimpleMenuListBox from "@/app/components/SimpleMenuListBox";
// import { SimpleMenuType } from "@/app/type/SimpleMenuType";
// import SuggestionMenuList from "@/app/components/SuggetionMenuList";
import AddToCartModal from "@/app/components/AddToCartModal";

export default function Simple() {
  // const [showAddToCart, setShowAddToCart] = useState<boolean>(false);
  const [showAddToCartModal, setShowAddToCartModal] = useState<boolean>(false);

  //=====with api===
  const [menuList, setMenuList] = useState([]);
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
        setMenuList(data);
      })
      .catch((error) => {
        console.error("Error fetching menus:", error);
      });
  }, []);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  if (menuList.length === 0) return <p>Loading or no data...</p>;

  return (
    <div className="bg-customBeige ">
      <div className="w-full max-w-[90%] m-auto px-2 lg:px-10">
        {/* <div className="relative mb-2">
          <h5 className="text-customGreen text-xl lg:text-2xl font-bold mb-2">SUGGESTION FOR YOU</h5>
          <SuggestionMenuList items={menuList} setShowAddToCart={setShowAddToCartModal} />
        </div> */}
        <div className="relative">
          <h5 className="text-customOrange text-lg lg:text-2xl font-bold mb-2">
            OUR MENU
          </h5>
          <SimpleMenuListBox
            items={menuList}
            row={isMobile ? 1 : 3}
            col={isMobile ? 1 : 3}
            setShowAddToCart={setShowAddToCartModal}
            page="simple" // <- this triggers the position change
          />
        </div>
      </div>
      {showAddToCartModal && (
        <AddToCartModal setAddToCartModal={setShowAddToCartModal} />
      )}
    </div>
  );
}
