"use client";
import { useRouter } from "next/navigation";
import { CrossIcon } from "./Icons";
import MenuListBox from "./MenuListBox";

type Props = {
  onClose: () => void;
};
const ChooseMenuModal = (props: Props) => {
  const router = useRouter();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 sm:h-1/3 lg:h-auto">
      <div className="bg-customBeige p-3 lg:p-8 rounded-lg shadow-lg w-11/12 sm:w-3/5 md:w-1/2 lg:w-3/5 relative max-h-full lg:max-h-auto">
        <h5 className="text-customOrange pb-3 text-xl lg:text-4xl text-center font-extrabold">
          CHOOSE YOUR MENU
        </h5>
        {/* Close Button */}
        <button
          className="absolute top-2 right-5 text-black-500"
          onClick={props.onClose}
        >
          <CrossIcon />
        </button>
        <ul className="flex justify-around items-center w-full flex-wrap gap-3">
          <MenuListBox
            header="SIMPLE MENU"
            bodyTxt1="EXPLORE"
            bodyTxt2="A SELECTION OF"
            bodyTxt3="DELIOUS MENU"
            btnTxt="VIEW"
            onClick={() => {
              props.onClose();
              router.push("/menu/simple");
            }}
          />
          <MenuListBox
            header="CUSTOMIZE MENU"
            bodyTxt1="GET A PERSONALIZED"
            bodyTxt2="MENU BASED ON YOUR"
            bodyTxt3="CALORIE NEEDS"
            btnTxt="CUSTOMIZE"
            onClick={() => {
              props.onClose();
              router.push("/menu/custom");
            }}
          />
        </ul>
      </div>
    </div>
  );
};

export default ChooseMenuModal;
