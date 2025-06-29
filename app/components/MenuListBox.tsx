type Props = {
  header: string;
  bodyTxt1: string;
  bodyTxt2: string;
  bodyTxt3: string;
  btnTxt: string;
  onClick: () => void;
};
const MenuListBox = (props: Props) => {
  return (
    <li className="group relative bg-white text-black w-80 p-1 rounded-lg flex items-center justify-around flex-col font-bold overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl">
      {/* Narrow 135-Degree Glass Reflection */}
      <div
        className="absolute top-[73%] left-[24%] w-[30rem] h-12 bg-customGreen rotate-[135deg] -translate-x-10 translate-y-10 
                group-hover:-translate-x-60 group-hover:-translate-y-60 transition-transform duration-500 ease-in-out"
      ></div>

      <h6 className="text-customGreen text-lg lg:text-2xl p-2 font-custom">
        {props.header}
      </h6>
      <p className="py-3 text-sm lg:text-base">
        <span className="block">{props.bodyTxt1}</span>
        <span className="block">{props.bodyTxt2}</span>
        <span className="block">{props.bodyTxt3}</span>
      </p>
      <button
        className="px-6 py-2 m-4 bg-customGreen text-white rounded transition-all duration-300 hover:scale-105 font-custom"
        onClick={props.onClick}
      >
        {props.btnTxt}
      </button>
    </li>
  );
};

export default MenuListBox;
