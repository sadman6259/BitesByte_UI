import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useState } from "react";

const SuggestionCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, startIndex: 1 });
  const [menuList] = useState([
    {
      id: 1,
      image: "/img/pork-chops.png",
      description:
        "Sustain your current body weight through caloric maintenance",
    },
    {
      id: 2,
      image: "/img/roast-leg-of-lamb.png",
      description:
        "Sustain your current body weight through caloric maintenance",
    },
    {
      id: 3,
      image: "/img/roast-leg-of-lamb.png",
      description:
        "Sustain your current body weight through caloric maintenance",
    },
    {
      id: 4,
      image: "/img/home-banner-fish.png",
      description:
        "Sustain your current body weight through caloric maintenanceustain your current body weight through caloric maintenance ustain your current body weight through caloric maintenance",
    },
    {
      id: 5,
      image: "/img/home-banner-fish.png",
      description:
        "Sustain your current body weight through caloric maintenance",
    },
  ]);

  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  return (
    <div className="mx-auto py-4 px-10 relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {menuList.map((num) => (
            <div key={num.id} className="flex-none w-full sm:w-1/3 p-2">
              <div className="bg-customGreen text-white p-3 text-center rounded-lg flex justify-between items-center">
                <div className="w-[30%] h-20 rounded-lg overflow-hidden">
                  <Image
                    src={num.image}
                    alt="image"
                    width={100}
                    height={50}
                    className="w-full h-full object-cover hover:scale-125"
                  />
                </div>
                <div className="w-2/3">
                  <p className="line-clamp-3 text-sm font-bold text-left">
                    {num.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={scrollPrev}
        className="absolute top-1/2 left-3 transform -translate-y-1/2 z-10 w-7 rounded-full border-[2px] border-customOrange hover:bg-customOrange"
      >
        <svg
          className="p-[6px] fill-customOrange hover:fill-customBeige"
          viewBox="0 0 532 532"
        >
          <path d="M355.66 11.354c13.793-13.805 36.208-13.805 50.001 0 13.785 13.804 13.785 36.238 0 50.034L201.22 266l204.442 204.61c13.785 13.805 13.785 36.239 0 50.044-13.793 13.796-36.208 13.796-50.002 0a5994246.277 5994246.277 0 0 0-229.332-229.454 35.065 35.065 0 0 1-10.326-25.126c0-9.2 3.393-18.26 10.326-25.2C172.192 194.973 332.731 34.31 355.66 11.354Z" />
        </svg>
      </button>
      <button
        onClick={scrollNext}
        className="absolute top-1/2 right-3 transform -translate-y-1/2 z-10 w-7 rounded-full border-[2px] border-customOrange hover:bg-customOrange"
      >
        <svg
          className="p-[6px] fill-customOrange hover:fill-customBeige"
          viewBox="0 0 532 532"
        >
          <path d="M176.34 520.646c-13.793 13.805-36.208 13.805-50.001 0-13.785-13.804-13.785-36.238 0-50.034L330.78 266 126.34 61.391c-13.785-13.805-13.785-36.239 0-50.044 13.793-13.796 36.208-13.796 50.002 0 22.928 22.947 206.395 206.507 229.332 229.454a35.065 35.065 0 0 1 10.326 25.126c0 9.2-3.393 18.26-10.326 25.2-45.865 45.901-206.404 206.564-229.332 229.52Z" />
        </svg>
      </button>
    </div>
  );
};

export default SuggestionCarousel;
