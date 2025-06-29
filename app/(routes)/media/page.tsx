"use client";
import React, { useState } from "react";
import {
  Instagram,
  Facebook,
  Youtube,
  X,
  ChevronLeft,
  ChevronRight,
  X as CloseIcon,
} from "lucide-react";

type MediaItem = {
  id: number;
  title: string;
  src: string;
  type: "image" | "video";
  date?: string;
  likes?: number;
};

const mediaItems: MediaItem[] = [
  {
    id: 1,
    title: "Healthy Breakfast",
    src: "https://via.placeholder.com/1200x800?text=Breakfast",
    type: "image",
    date: "2023-05-15",
    likes: 124,
  },
  {
    id: 2,
    title: "Salad Bowl",
    src: "https://via.placeholder.com/1200x800?text=Salad",
    type: "image",
    date: "2023-06-22",
    likes: 89,
  },
  {
    id: 3,
    title: "Grilled Chicken",
    src: "https://via.placeholder.com/1200x800?text=Grilled+Chicken",
    type: "image",
    date: "2023-07-10",
    likes: 156,
  },
  {
    id: 4,
    title: "Smoothie Time",
    src: "https://via.placeholder.com/1200x800?text=Smoothie",
    type: "image",
    date: "2023-08-05",
    likes: 201,
  },
  {
    id: 5,
    title: "Workout Session",
    src: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    type: "video",
    date: "2023-09-12",
    likes: 312,
  },
  {
    id: 6,
    title: "Meal Prep",
    src: "https://via.placeholder.com/1200x800?text=Meal+Prep",
    type: "image",
    date: "2023-10-18",
    likes: 178,
  },
];

export default function MediaPage() {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openMedia = (item: MediaItem, index: number) => {
    setSelectedMedia(item);
    setCurrentIndex(index);
  };

  const closeMedia = () => {
    setSelectedMedia(null);
  };

  const navigate = (direction: "prev" | "next") => {
    let newIndex;
    if (direction === "prev") {
      newIndex = (currentIndex - 1 + mediaItems.length) % mediaItems.length;
    } else {
      newIndex = (currentIndex + 1) % mediaItems.length;
    }
    setSelectedMedia(mediaItems[newIndex]);
    setCurrentIndex(newIndex);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-customOrange">
        Our Media Gallery
      </h1>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mediaItems.map((item, index) => (
          <div
            key={item.id}
            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
            onClick={() => openMedia(item, index)}
          >
            <div className="relative">
              {item.type === "video" ? (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <div className="w-16 h-16 bg-customOrange rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  </div>
                  <img
                    src={`https://img.youtube.com/vi/${item.src
                      .split("/")
                      .pop()}/hqdefault.jpg`}
                    alt={item.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
              ) : (
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-64 object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div className="text-white">
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <span>{item.date}</span>
                    <span>•</span>
                    <span>{item.likes} likes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4">
          <button
            onClick={closeMedia}
            className="absolute top-6 right-6 text-white hover:text-customOrange transition-colors z-10"
          >
            <CloseIcon className="w-8 h-8" />
          </button>

          <button
            onClick={() => navigate("prev")}
            className="absolute left-6 text-white hover:text-customOrange transition-colors z-10 p-2"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <div className="relative w-full max-w-4xl max-h-[90vh]">
            {selectedMedia.type === "video" ? (
              <div className="aspect-video w-full">
                <iframe
                  src={`${selectedMedia.src}?autoplay=1`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <img
                src={selectedMedia.src}
                alt={selectedMedia.title}
                className="w-full h-auto max-h-[80vh] object-contain mx-auto"
              />
            )}
            <div className="bg-black/70 text-white p-4 mt-2 rounded-b-lg">
              <h3 className="text-xl font-bold">{selectedMedia.title}</h3>
              <div className="flex justify-between items-center mt-2 text-sm">
                <span>{selectedMedia.date}</span>
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4 fill-current text-red-500"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 3.22l-.61-.6a5.5 5.5 0 0 0-7.78 7.77L10 18.78l8.39-8.4a5.5 5.5 0 0 0-7.78-7.77l-.61.61z" />
                  </svg>
                  {selectedMedia.likes} likes
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("next")}
            className="absolute right-6 text-white hover:text-customOrange transition-colors z-10 p-2"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}

      {/* Social Media Links */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold text-customGreen mb-6">
          Join Our Community
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          {[
            {
              icon: Instagram,
              url: "https://instagram.com/Bitesbyte",
              name: "Instagram",
            },
            {
              icon: Facebook,
              url: "https://facebook.com/Bitesbyte",
              name: "Facebook",
            },
            {
              icon: Youtube,
              url: "https://youtube.com/Bitesbyte",
              name: "YouTube",
            },
            { icon: X, url: "https://twitter.com/Bitesbyte", name: "Twitter" },
          ].map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center w-24 h-24 bg-white rounded-xl shadow-md hover:shadow-lg transition-all hover:bg-customBeige group"
            >
              <social.icon className="w-8 h-8 text-customGray group-hover:text-customOrange transition-colors" />
              <span className="mt-2 text-sm font-medium text-customGray group-hover:text-customOrange transition-colors">
                {social.name}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold text-customGreen mb-8 text-center">
          Customer Stories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              quote:
                "Bitesbyte transformed my eating habits completely. The meals are delicious and I've never felt better!",
              author: "Sarah L.",
              role: "Fitness Enthusiast",
              rating: 5,
            },
            {
              quote:
                "As a busy professional, Bitesbyte saves me hours of meal prep without compromising on nutrition.",
              author: "Michael T.",
              role: "Marketing Director",
              rating: 5,
            },
            {
              quote:
                "The variety keeps me excited about healthy eating. I look forward to every meal!",
              author: "Aishah N.",
              role: "Yoga Instructor",
              rating: 4,
            },
          ].map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonial.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-customGray italic mb-4">
                "{testimonial.quote}"
              </p>
              <div>
                <p className="font-bold text-customGreen">
                  {testimonial.author}
                </p>
                <p className="text-sm text-customGray">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Google Reviews CTA */}
      <div className="mt-16 bg-customOrange/10 p-8 rounded-xl text-center">
        <h2 className="text-2xl font-semibold text-customGreen mb-4">
          Share Your Experience
        </h2>
        <p className="text-customGray mb-6 max-w-2xl mx-auto">
          We value your feedback! Help others discover Bitesbyte by leaving a
          review on Google.
        </p>
        <a
          href="https://www.google.com/search?q=bitesbyte"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 bg-customOrange text-white rounded-lg font-medium hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg"
        >
          Write a Review
          <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
