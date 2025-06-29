"use client";
import { useState } from "react";
import { Phone, Mail, Clock, MapPin, Truck, ShoppingBag } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [activeLocation, setActiveLocation] = useState(0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    // You can send form data to an API here
  };

  const locations = [
    {
      name: "Subang-Jaya",
      address: "3a Jalan USJ 11/3, USJ Subang Jaya 47620 Selangor Malaysia",
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.715415042983!2d101.58347431533194!3d3.043980254328998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc4b7c1a6f05a5%3A0x3a0f5a5b5d5b5b5b!2sFitnacle%20Subang%20Jaya!5e0!3m2!1sen!2smy!4v1620000000000!5m2!1sen!2smy",
    },
    {
      name: "Kota-Kemuning",
      address:
        "32a Jalan Anggerik Eria AT 31/AT Kota Kemuning Shah Alam 40460 Selangor",
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.715415042983!2d101.58347431533194!3d3.043980254328998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc4b7c1a6f05a5%3A0x3a0f5a5b5d5b5b5b!2sFitnacle%20Kota%20Kemuning!5e0!3m2!1sen!2smy!4v1620000000000!5m2!1sen!2smy",
    },
    {
      name: "Seri-Kembangan",
      address:
        "No 25-1 Jalan BS 1/3, Pusat Perniagaan Olive Hills, Taman Bukit Serdang, 43300, Seri Kembangan",
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.715415042983!2d101.58347431533194!3d3.043980254328998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc4b7c1a6f05a5%3A0x3a0f5a5b5d5b5b5b!2sFitnacle%20Seri%20Kembangan!5e0!3m2!1sen!2smy!4v1620000000000!5m2!1sen!2smy",
    },
    {
      name: "USJ21 BitesByte",
      address: "No 7-2, Jalan USJ 21/8, 47630 UEP Subang Jaya, Selangor",
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.715415042983!2d101.58347431533194!3d3.043980254328998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc4b7c1a6f05a5%3A0x3a0f5a5b5d5b5b5b!2sBitesByte%20USJ%2021!5e0!3m2!1sen!2smy!4v1620000000000!5m2!1sen!2smy",
    },
  ];

  return (
    <div className="flex flex-col p-8 gap-8 bg-customBeige text-customGray min-h-screen">
      <h1 className="text-3xl font-bold text-customOrange">Contact Us</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Info Panel */}
        <div className="space-y-8">
          <div className="space-y-4 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-customOrange flex items-center gap-2">
              <Phone className="w-5 h-5" />
              General Information
            </h2>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <strong>Phone:</strong> 03-
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <strong>Email:</strong> contact@bitesbyte.com
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-customOrange flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5" />
              Operating Hours
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-customBeige p-4 rounded">
                <h3 className="font-medium text-customOrange flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Dine-in
                </h3>
                <p>Weekdays: 9am – 9pm</p>
                <p>Weekends: 9am – 5pm</p>
              </div>
              <div className="bg-customBeige p-4 rounded">
                <h3 className="font-medium text-customOrange flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  Delivery
                </h3>
                <p>Monday – Sunday: 11am – 4pm</p>
              </div>
              <div className="bg-customBeige p-4 rounded">
                <h3 className="font-medium text-customOrange flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Self Pickup
                </h3>
                <p>Monday – Sunday: 11am – 8pm</p>
              </div>
            </div>
          </div>

          {/* Message Form */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-customOrange mb-4">
              Send a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-customOrange focus:border-transparent"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  required
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-customOrange focus:border-transparent"
                />
              </div>
              <div>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Your Message"
                  required
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-customOrange focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="bg-customGreen text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium w-full"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Location Maps */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-customOrange flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Our Locations
          </h2>

          {/* Location Tabs */}
          <div className="flex overflow-x-auto pb-2 gap-2">
            {locations.map((location, index) => (
              <button
                key={index}
                onClick={() => setActiveLocation(index)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  activeLocation === index
                    ? "bg-customOrange text-white"
                    : "bg-white text-customGray hover:bg-gray-100"
                }`}
              >
                {location.name.split(" ")[0]}
              </button>
            ))}
          </div>

          {/* Active Location Map */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-lg text-customOrange mb-2">
              {locations[activeLocation].name}
            </h3>
            <p className="mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              {locations[activeLocation].address}
            </p>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={locations[activeLocation].mapUrl}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                className="rounded-lg"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
