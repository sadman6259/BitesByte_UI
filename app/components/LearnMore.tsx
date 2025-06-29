"use client";

type Props = {
  setIsModalOpen: (open: boolean) => void;
};

export default function LearnMore({ setIsModalOpen }: Props) {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-green-600 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 uppercase">
          EAT RIGHT AND LIVE TRULY HEALTHY WITH BITESBYTE
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl mb-4">
          Out with the mundane choices and in with conscious lifestyle of
          healthy choices that allows you to flourish.
        </p>
        <p className="max-w-2xl mx-auto text-md md:text-lg font-light">
          With Bitesbyte, you can forget about counting your calories or
          sourcing for healthy choices of food and actually focus on what’s
          important, living healthy.
        </p>

        <button
          className="mt-4 px-4 rounded-lg py-2 bg-customOrange font-semibold text-white"
          onClick={() => setIsModalOpen(true)}
        >
          Start Today
        </button>
      </section>

      {/* Informational Sections */}
      <section className="bg-white text-customGreen py-20 px-6 space-y-24">
        {/* Section 1 - Text Left, Image Right */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Your food, your way!
            </h2>
            <p className="text-lg text-customGray">
              We have spent a lot of time here and perhaps this is where our
              expertise lies the most, making sure that each individual is
              eating according to their specific nutritional goals. We don’t
              simply serve you healthy food and let you figure the rest out, we
              take the next challenging step of personalizing it for you.
            </p>
          </div>
          <div className="w-full h-64 bg-gray-200 rounded-md shadow-inner flex items-center justify-center text-gray-500 text-sm">
            {/* Replace this div with an actual image */}
            Image Box
          </div>
        </div>

        {/* Section 2 - Image Left, Text Right */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="w-full h-64 bg-gray-200 rounded-md shadow-inner flex items-center justify-center text-gray-500 text-sm">
            {/* Replace this div with an actual image */}
            Image Box
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Holistic approach to nutrition and health
            </h2>
            <p className="text-lg text-customGray">
              To understand nutrition it’s imperative to understand a person’s
              health status, background, fitness level, body composition etc
              because achieving nutritional goal could probably be a
              conglomeration of all these elements intertwined. It’s important
              for us to dissect these elements and amplify the weak signals,
              helping you make the necessary changes.
            </p>
          </div>
        </div>

        {/* Section 3 - Text Left, Image Right */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Simplicity beats complexity
            </h2>
            <p className="text-lg text-customGray">
              Bitesbyte brings the power back to you, right at your fingertips
              you can make a few clicks that can potentially change your life
              forever. We have simplified the process of eating healthy
              nutritious diet and eliminated the hassles so you can enjoy the
              bliss of healthy living.
            </p>
          </div>
          <div className="w-full h-64 bg-gray-200 rounded-md shadow-inner flex items-center justify-center text-gray-500 text-sm">
            {/* Replace this div with an actual image */}
            Image Box
          </div>
        </div>
      </section>
    </>
  );
}
