import React, { useState, useEffect, useCallback } from "react";
import { CrossIcon, TickIcon } from "./Icons";
import Singup from "./Singup";
import useEmblaCarousel from "embla-carousel-react";
import "./../css/slide.css";
import Image from "next/image";

export default function PlanDetailModal({
  plan,
  onClose,
}: {
  plan: {
    title: string;
    description: string;
    color: string;
    icon: string;
    whiteIcon: string;
    size: number;
  };
  onClose: () => void;
}) {
  const features = [
    "Virtual guardian",
    "Micro nutrients breakdown",
    "Body Composition Report",
    "Exercise programs with video",
    "Nutrient Analysis",
    "Recommended Meal",
    "Free registration fee for Fitnacle membership",
    "Progressive nutrition tracking",
    "Micro nutrients breakdown(RDA)",
    "5% discount on daily meals",
    "Personal User Profile",
    "Food Intake log && Water Intake log",
    "Body Fat Chart",
    "Weight Loss Challenge",
    "Calorie Chart",
    "Food Caloric Value",
    "Daily Target Calories",
    "Goal Management Dashboard",
    "Exercise Logs && Body Logs",
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    startIndex: 0,
    align: "center",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dotCount, setDotCount] = useState(0);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  useEffect(() => {
    if (emblaApi) {
      setDotCount(emblaApi.slideNodes().length);
      const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
      emblaApi.on("select", onSelect);
      onSelect();
    }
  }, [emblaApi]);

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-customBeige border-2 border-customOrange rounded-lg w-full max-w-4xl relative">
        {/* Header */}
        <div className="bg-customOrange p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white tracking-wider">
            {plan.title} Plan
          </h1>
          <button
            onClick={onClose}
            className="text-white hover:scale-110 transition"
          >
            <CrossIcon />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 grid md:grid-cols-2 gap-8">
          {/* Carousel Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-customGray border-b-2 border-customOrange pb-2">
              How It Works
            </h2>
            <div className="embla overflow-hidden rounded-lg">
              <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                  {[
                    {
                      img: "/img/img-subscription-plan.png",
                      title: "Select plan and signup",
                      desc: "Your plan tells us about your specific nutritional goal",
                    },
                    {
                      img: "/img/img-calc-calories.png",
                      title: "Calculate your calories",
                      desc: "Select your metric to calculate your calories",
                    },
                    {
                      img: "/img/home-banner-fish.png",
                      title: "Receive meals",
                      desc: "Chef prepped, dietician approved recipes",
                    },
                  ].map((item, i) => (
                    <div className="embla__slide min-w-full" key={i}>
                      <div className="bg-white p-4 rounded-lg h-full">
                        <div className="aspect-video relative mb-3">
                          <Image
                            src={item.img}
                            alt={item.title}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-customGray">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center gap-2 mt-3">
                {Array(dotCount)
                  .fill(0)
                  .map((_, i) => (
                    <button
                      key={i}
                      onClick={() => scrollTo(i)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        selectedIndex === i ? "bg-customOrange" : "bg-gray-300"
                      }`}
                    />
                  ))}
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-customGray border-b-2 border-customOrange pb-2">
              Plan Features
            </h2>
            <div className="bg-white p-4 rounded-lg h-[400px] overflow-y-auto">
              <ul className="space-y-3">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <TickIcon />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-customOrange flex justify-end">
          <button
            onClick={() => setIsSignupModalOpen(true)}
            className="px-6 py-2 bg-customGreen text-white rounded hover:bg-green-600 transition-colors font-medium"
          >
            Conteniue
          </button>
        </div>

        {isSignupModalOpen && (
          <Singup plan={plan} onClose={() => setIsSignupModalOpen(false)} />
        )}
      </div>
    </div>
  );
}
