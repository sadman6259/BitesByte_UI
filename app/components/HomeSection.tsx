import Image from "next/image";

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
};
export default function HomeSection({ isModalOpen, setIsModalOpen }: Props) {
  return (
    <section
      className={`relative flex flex-col items-center justify-center h-[calc(100vh-109px)] bg-customBeige ${
        isModalOpen ? "backdrop-blur-sm" : ""
      }`}
    >
      <h1 className="lg:text-6xl md:text-5xl text-4xl text-customOrange capitalize w-2/3 text-center font-custom -mt-10">
        A journey of a thousand miles starts with your first step
      </h1>
      <h1 className="lg:text-4xl md:text-3xl text-2xl font-bold text-green-600 w-4/5 text-center py-4 font-custom">
        Take your first step into your nutrition and understand your body better.
      </h1>
      <div className="pb-8">
        <button
          className="mt-4 px-4 rounded-lg py-2 bg-customOrange font-semibold text-white"
          onClick={() => setIsModalOpen(true)}
        >
          Start Your Journey Here
        </button>
      </div>
      <Image
        key="/img/home-banner-fish.png"
        src="/img/home-banner-fish.png"
        alt="/img/home-banner-fish.png"
        width={100}
        height={100}
        className="absolute bottom-0 left-0 w-1/4 h-auto"
      />
      <Image
        key="/img/home-banner-fruit.png"
        src="/img/home-banner-fruit.png"
        alt="/img/home-banner-fruit.png"
        width={100}
        height={100}
        className="absolute bottom-0 right-0 w-1/4 h-auto"
      />
    </section>
  );
}
