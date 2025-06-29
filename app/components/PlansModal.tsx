import { CrossIcon } from "./Icons";
import { useState } from "react";
import PlanDetailModal from "./PlanDetailModal";
import Image from "next/image";
import { useAtom } from "jotai";
import { sharedPlanAtom } from "./store";

type Plan = {
  title: string;
  description: string;
  color: string;
  icon: string;
  whiteIcon: string;
  size: number;
};
export default function PlanModal({
  planModalOpen,
  setPlanModalOpen,
}: {
  planModalOpen: boolean;
  setPlanModalOpen: (open: boolean) => void;
}) {
  const [selectedPlan, setSelectedPlan] = useAtom(sharedPlanAtom) as [
    Plan | null,
    (plan: Plan | null) => void
  ];
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
    // console.log("this is index", index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const plans = [
    {
      title: "Weight Loss",
      description: "Reduce overall body weight through gradual caloric deficit",
      color: "customGreen",
      icon: "/img/img-weight-loss.png",
      whiteIcon: "/img/img-white-weight-loss.png",
      size: 50,
    },
    {
      title: "Lean Body Mass",
      description: "Increase overall body weight mass through caloric surplus",
      color: "customOrange",
      icon: "/img/img-lean-mass.png",
      whiteIcon: "/img/img-white-lean-mass.png",
      size: 50,
    },
    {
      title: "Maintenance",
      description:
        "Sustain your current body weight through caloric maintenance",
      color: "customGreen",
      icon: "/img/img-maintenance.png",
      whiteIcon: "/img/img-white-maintenance.png",
      size: 70,
    },
    {
      title: "Lean Muscle Mass",
      description:
        "Build lean muscle by increasing overall daily caloric percentage of protein intake and cutting carbs",
      color: "customOrange",
      icon: "/img/img-lean-muscle.png",
      whiteIcon: "/img/img-white-lean-muscle.png",
      size: 50,
    },
  ];

  if (!planModalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black text-black bg-opacity-50 z-50">
      {selectedPlan ? (
        <>
          <PlanDetailModal
            plan={selectedPlan}
            onClose={() => setSelectedPlan(null)}
          />
        </>
      ) : (
        <>
          <div className="bg-customBeige p-6 rounded-lg shadow-lg w-4/5 relative">
            <button
              className="absolute top-2 right-5 text-black-500"
              onClick={() => setPlanModalOpen(false)}
            >
              <CrossIcon />
            </button>

            <div className="my-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className="relative bg-white cursor-pointer p-6 w-full h-64 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 overflow-hidden group"
                  onClick={() => handlePlanSelect(plan)}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div
                    className={`absolute -bottom-4 -right-4 w-10 h-10 bg-${plan.color} rounded-full transform scale-4 group-hover:scale-[17] transition-transform duration-700 ease-in-out`}
                  ></div>
                  <div
                    className={`relative pb-3 z-10 flex flex-col items-center justify-between h-full text-center group-hover:text-white duration-700 ease-in-out ${`text-${plan.color}`}`}
                  >
                    <h2 className="text-xl font-bold mb-4 h-8 flex items-center justify-center">
                      {plan.title}
                    </h2>
                    <div>
                      <Image
                        key={plan.icon}
                        src={
                          hoveredIndex === index ? plan.whiteIcon : plan.icon
                        }
                        alt={plan.icon}
                        width={plan.size}
                        height={plan.size}
                        className="w-full h-auto"
                      />
                    </div>
                    <p className="text-sm mt-2 h-14 flex items-center justify-center">
                      {plan.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <h1 className="text-3xl text-center font-custom font-bold text-customGray mb-4 tracking-custom">
              Subscription Plans
            </h1>
          </div>
        </>
      )}
    </div>
  );
}
