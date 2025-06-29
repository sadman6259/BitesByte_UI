import { CrossIcon } from "./Icons";

export default function CalcResultModal({
  calcResultModalOpen,
  setCalcResultModalOpen,
  setPlanModalOpen,
}: {
  calcResultModalOpen: boolean;
  setCalcResultModalOpen: (open: boolean) => void;
  setPlanModalOpen: (open: boolean) => void;
}) {
  if (!calcResultModalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black text-black bg-opacity-50 z-50">
      <div className="bg-customBeige p-6 rounded-lg shadow-lg w-1/2 relative">
        <button
          className="absolute top-2 right-5 text-black-500"
          onClick={() => setCalcResultModalOpen(false)}
        >
          <CrossIcon />
        </button>
        <div className="mt-5 flex justify-between">
          <div className="rounded-lg shadow-md w-full md:w-3/4 lg:w-full xl:w-full">
            <div className="p-4 bg-white border-2 border-customOrange mb-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold font-custom">Your Stats</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-black">
                  <tbody>
                    <tr>
                      <td className="border-2 border-black px-3">Height</td>
                      <td className="border-2 border-black px-3">192cm</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border-2 border-black px-3">Weight</td>
                      <td className="border-2 border-black px-3">80kg</td>
                    </tr>
                    <tr>
                      <td className="border-2 border-black px-3">Age</td>
                      <td className="border-2 border-black px-3">29</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border-2 border-black px-3">Gender</td>
                      <td className="border-2 border-black px-3">Female</td>
                    </tr>
                    <tr>
                      <td className="border-2 border-black px-3">
                        Activity Level
                      </td>
                      <td className="border-2 border-black px-3">Moderate</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="text-center border-2 border-customOrange bg-white py-11 shadow-inner">
              <h3 className="text-2xl font-bold font-custom">
                Your Maintenance Calories
              </h3>
              <p className="text-4xl font-bold font-custom">3,286</p>
              <p className="font-custom text-xl">per day</p>
            </div>
          </div>

          <div className="bg-white border-2 border-customOrange p-2 shadow-md w-full md:w-3/4 lg:w-full xl:w-full mt-6 md:mt-0 md:ml-6">
            <p className="mb-6 leading-loose text-justify font-custom text-xl">
              Based on your stats, the best estimate for your maintenance
              calories is 3,286 calories per day.
              <br /> Understanding your calories for weight maintenance is a
              crucial first step into your specific nutrition requirements. Tell
              us more about what you wish to achieve with your nutrition.
            </p>
            <div className="flex justify-center">
              <button
                className="px-8 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                onClick={() => {
                  setCalcResultModalOpen(false);
                  setPlanModalOpen(true);
                }}
              >
                Choose a Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
