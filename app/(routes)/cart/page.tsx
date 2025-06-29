"use client";
import Image from "next/image";
import { useAtom } from "jotai";
import { cartAtom } from "../../store/menuQuantityStore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CardInput from "../../components/CardNumber";
import axios from "axios";
//import dynamic from "next/dynamic";
import DatePicker from "react-datepicker";

// Dynamically import DatePicker to avoid SSR issues

// Dynamically import the CSS since it's client-side only
import "react-datepicker/dist/react-datepicker.css";

const Cart = () => {
  const router = useRouter();
  const [cart, setCart] = useAtom(cartAtom);
  const [remarks, setRemarks] = useState("");
  const [orderReferenceNo, setOrderReferenceNo] = useState(null);
  const [activePaymentTab, setActivePaymentTab] = useState<"card" | "cod">(
    "card"
  );
  const [user, setUser] = useState<{
    name: string;
    email: string;
  } | null>(null);
  // Initialize dates safely
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    if (typeof window === "undefined") return null;
    return null;
  });

  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    isValid: false,
  });
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");

  type FormField =
    | "firstName"
    // | "lastName"
    | "street"
    | "phone"
    | "email"
    | "companyName";
  type FormShippingField =
    | "country"
    | "state"
    | "city"
    | "zip"
    | "locations"
    | "date"
    | "street"
    | "time"
    | "apartmentUnit";

  type FormType = Record<FormField, string>;
  type FormShippingType = Record<FormShippingField, string>;

  // Initialize form state safely
  const [form, setForm] = useState<FormType>(() => {
    // Only pre-fill if we have a user and are in the browser
    if (typeof window !== "undefined" && localStorage.getItem("userEmail")) {
      return {
        firstName: user?.name?.split(" ")[0] || "",
        street: "",
        phone: "",
        email: user?.email || "",
        companyName: "",
      };
    }
    return {
      firstName: "",
      street: "",
      phone: "",
      email: "",
      companyName: "",
    };
  });

  const [showAddressAccordion, setShowAddressAccordion] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<FormShippingType>(
    () => ({
      country: "Malaysia",
      state: "",
      city: "",
      zip: "",
      locations: "",
      street: "",
      apartmentUnit: "",
      date: "",
      time: "",
    })
  );

  const clearUserData = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");

    setUser(null);
    setUserPaymentInfo([]);
    setForm({
      firstName: "",
      street: "",
      phone: "",
      email: "",
      companyName: "",
    });
    setCardDetails({
      number: "",
      expiry: "",
      cvv: "",
      isValid: false,
    });
    setSelectedPayment(null);
  };
  type PaymentInfo = {
    id: number;
    cardNo: string;
    expiryDate: string;
    cvv: string;
  };
  // Add this to your existing state declarations
  const [userPaymentInfo, setUserPaymentInfo] = useState<PaymentInfo[]>([]);
  const [loadingPaymentInfo, setLoadingPaymentInfo] = useState(false);
  const fetchUserPaymentInfo = async (userId: number) => {
    setLoadingPaymentInfo(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BITESBYTE_API_URL}/getuserpaymentinfolistbyuserid?userid=${userId}`
      );
      setUserPaymentInfo(response.data);
    } catch (error) {
      console.error("Failed to fetch payment info:", error);
    } finally {
      setLoadingPaymentInfo(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        if (email) {
          const response = await axios.get(
            `${
              process.env.NEXT_PUBLIC_BITESBYTE_API_URL
            }/getuserbyemail?email=${encodeURIComponent(email)}`
          );
          setUser({
            name: response.data.name,
            email: response.data.email,
          });
          fetchUserPaymentInfo(response.data.id);
        } else {
          // Ensure all user data is cleared if no email in localStorage
          clearUserData();
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        clearUserData();
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        firstName: user.name.split(" ")[0] || "",
        email: user.email || "",
      }));
    } else {
      // Reset form when user logs out
      setForm({
        firstName: "",
        street: "",
        phone: "",
        email: "",
        companyName: "",
      });
    }
  }, [user]);

  const [shippingerrors, setShippingErrors] = useState<
    Partial<Record<FormShippingField, string>>
  >({});
  const [errors, setErrors] = useState<Partial<Record<FormField, string>>>({});

  // Safe date calculations
  const today = typeof window !== "undefined" ? new Date() : new Date(0);
  const minSelectableDate = new Date(today);
  minSelectableDate.setDate(today.getDate() + 2);

  const timeSlots = [
    { label: "Morning (9 AM - 11 AM)", value: "morning" },
    { label: "Afternoon (2 PM - 4 PM)", value: "afternoon" },
    { label: "Night (7 PM - 9 PM)", value: "night" },
  ];

  const subtotal = cart.reduce(
    (acc, item) => acc + item.menu.price * item.quantity,
    0
  );
  const totalCalories = cart
    .reduce((acc, item) => acc + item.menu.totalCalories * item.quantity, 0)
    .toFixed(0);

  const [shippingMethod, setShippingMethod] = useState<"delivery" | "pickup">(
    "pickup"
  );

  const shippingFee = shippingMethod === "delivery" ? 6 : 0;
  const totalPrice = (subtotal + shippingFee).toFixed(2);

  const [showModal, setShowModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const closeSuccessModal = () => {
    setSuccessModal(false);
    setCart([]);
    // router.push("/");
  };

  const getTimeForSlot = (slot: string): { hour: number; minute: number } => {
    switch (slot) {
      case "morning":
        return { hour: 9, minute: 0 };
      case "afternoon":
        return { hour: 14, minute: 0 };
      case "night":
        return { hour: 19, minute: 0 };
      default:
        return { hour: 0, minute: 0 };
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<FormField, string>> = {};
    const newShippingErrors: Partial<Record<FormShippingField, string>> = {};

    if (!form.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    // if (!form.lastName.trim()) {
    //   newErrors.lastName = "Last name is required";
    // }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10,15}$/.test(form.phone)) {
      newErrors.phone = "Enter a valid phone number";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!form.street.trim()) {
      newErrors.street = "Street address is required";
    }

    if (shippingMethod === "delivery") {
      if (!shippingAddress.state) {
        newShippingErrors.state = "State is required";
      }
      if (!shippingAddress.city.trim()) {
        newShippingErrors.city = "City is required";
      }
      if (!shippingAddress.zip.trim()) {
        newShippingErrors.zip = "ZIP Code is required";
      }
      if (!shippingAddress.apartmentUnit.trim()) {
        newShippingErrors.apartmentUnit = "Apartment/Unit is required";
      }
      if (!selectedDate) {
        newShippingErrors.date = "Delivery date is required";
      }
      if (!selectedTimeSlot) {
        newShippingErrors.time = "Delivery time is required";
      }
    }

    if (shippingMethod === "pickup") {
      if (!shippingAddress.state) {
        newShippingErrors.state = "State is required";
      }
      if (!shippingAddress.city.trim()) {
        newShippingErrors.city = "City is required";
      }
      if (!shippingAddress.zip.trim()) {
        newShippingErrors.zip = "ZIP Code is required";
      }
      if (!shippingAddress.locations) {
        newShippingErrors.locations = "Pickup location is required";
      }
    }

    setErrors(newErrors);
    setShippingErrors(newShippingErrors);

    return (
      Object.keys(newErrors).length === 0 &&
      Object.keys(newShippingErrors).length === 0
    );
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setShowModal(true);
      return;
    }

    if (activePaymentTab === "card") {
      const isSavedCardSelected = selectedPayment?.startsWith("card-");
      if (!isSavedCardSelected && !cardDetails.isValid) {
        setShowModal(true);
        return;
      }
    }

    try {
      let deliveryDateTime = new Date();
      if (selectedDate && selectedTimeSlot) {
        const time = getTimeForSlot(selectedTimeSlot);
        deliveryDateTime = new Date(selectedDate);
        deliveryDateTime.setHours(time.hour, time.minute, 0, 0);
      }

      let finalCardDetails = {
        number: "",
        expiry: "",
        cvv: "",
      };

      if (activePaymentTab === "card") {
        if (selectedPayment?.startsWith("card-")) {
          const cardId = selectedPayment.split("-")[1];
          const selectedCard = userPaymentInfo.find(
            (card) => card.id.toString() === cardId
          );
          if (selectedCard) {
            finalCardDetails = {
              number: selectedCard.cardNo,
              expiry: selectedCard.expiryDate,
              cvv: selectedCard.cvv,
            };
          }
        } else {
          finalCardDetails = {
            number: cardDetails.number,
            expiry: cardDetails.expiry,
            cvv: cardDetails.cvv,
          };
        }
      }

      const isLoggedIn = !!localStorage.getItem("userEmail");
      const email = localStorage.getItem("userEmail");
      let userId = 0;

      // For logged-in users, get the user ID
      if (isLoggedIn && email) {
        const userResponse = await axios.get(
          `${
            process.env.NEXT_PUBLIC_BITESBYTE_API_URL
          }/getuserbyemail?email=${encodeURIComponent(email)}`
        );
        userId = userResponse.data.id;
      }

      const payload = {
        order: {
          id: 0,
          orderReferenceNo: "",
          userId: isLoggedIn ? userId : 0,
          totalPrice: parseFloat(totalPrice),
          createdDate: new Date().toISOString(),
          deliveryDateTime: deliveryDateTime.toISOString(),
          remarks: remarks,
          deliveryMethod: shippingMethod,
          pickupLocation:
            shippingMethod === "pickup" ? shippingAddress.locations : "",
          paymentMethod: activePaymentTab === "card" ? "Card" : "Cash",
          cardNumber:
            activePaymentTab === "card" ? finalCardDetails.number : "",
          isPaymentDone: false,
          isGuestUser: !isLoggedIn,
        },
        orderDetail: cart.map((item) => ({
          id: 0,
          menuId: item.menu.id,
          quantity: item.quantity,
          orderReferenceNo: "",
          totalPrice: item.menu.price * item.quantity,
          createdTime: new Date().toISOString(),
          totalGrams: item.menu.totalCalories,
        })),
      };

      let response;
      if (isLoggedIn) {
        // Use the logged-in user endpoint
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/placeorderloggedinuser`,
          payload
        );
      } else {
        // Use the guest user endpoint with additional guest info
        const guestPayload = {
          ...payload,
          guestUser: {
            id: 0,
            firstName: form.firstName,
            companyName: form.companyName,
            street: form.street,
            apartmentUnit: shippingAddress.apartmentUnit,
            city: shippingAddress.city,
            state: shippingAddress.state,
            postCode: shippingAddress.zip,
            phone: form.phone,
            email: form.email,
            cardNo: finalCardDetails.number,
            cvv: finalCardDetails.cvv,
            expiryDate: finalCardDetails.expiry,
          },
        };
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/placeorderguest`,
          guestPayload
        );
      }

      setOrderReferenceNo(response.data.orderReferenceNo);
      setSuccessModal(true);
      setCart([]);
    } catch (err) {
      console.error("Checkout error:", err);
      // Handle error state if needed
    }
  };

  const Cancel = () => {
    const isLoggedIn = !!localStorage.getItem("userEmail"); // Check if user is logged in

    if (isLoggedIn) {
      router.push("/portfolio");
    } else {
      router.push("/");
    }
  };

  const CLEARALL = () => {
    setCart([]);
    Cancel();
  };

  // Format date safely for display
  const formatSelectedDate = () => {
    if (!selectedDate) return "";
    return selectedDate.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="text-customGray">
      <div className="lg:w-[1080px] md:w-[500px] w-[500px] mx-auto p-2">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          {/* Delivery Address */}
          <div className="w-full md:w-[49%] border-2 border-customGreen rounded-md bg-white p-4 text-customGreen">
            <h5 className="mx-auto block text-center font-bold text-2xl mb-5">
              DELIVERY ADDRESS
            </h5>
            {Object.entries(form).map(([key, value]) => {
              const typedKey = key as FormField;

              return (
                <div key={typedKey} className="mb-3">
                  <label
                    htmlFor={typedKey}
                    className="block font-bold text-xs pl-2 uppercase"
                  >
                    {typedKey.replace(/([A-Z])/g, " $1").toUpperCase()}
                  </label>
                  <input
                    type="text"
                    name={typedKey}
                    id={typedKey}
                    value={value}
                    onChange={handleInputChange}
                    className={`border-2 ${
                      errors[typedKey] ? "border-red-500" : "border-customGreen"
                    } rounded-md p-2 w-full`}
                  />
                  {errors[typedKey] && (
                    <p className="text-xs text-red-500 mt-1 pl-2">
                      {errors[typedKey]}
                    </p>
                  )}
                </div>
              );
            })}

            {/* Shipping Method */}
            {cart.length > 0 && (
              <div className="border-2 border-customOrange rounded-md bg-white p-4 text-customGreen mt-4">
                <h5 className="font-bold text-lg mb-4">Receiving METHOD</h5>
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shipping"
                      value="delivery"
                      checked={shippingMethod === "delivery"}
                      onChange={() => setShippingMethod("delivery")}
                    />
                    Delivery (+RM 6)
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shipping"
                      value="pickup"
                      checked={shippingMethod === "pickup"}
                      onChange={() => setShippingMethod("pickup")}
                    />
                    Pickup (Free)
                  </label>
                </div>

                {/* Accordion for Delivery Address */}
                {shippingMethod === "delivery" && (
                  <div>
                    <button
                      onClick={() =>
                        setShowAddressAccordion(!showAddressAccordion)
                      }
                      className="bg-customOrange text-white font-bold px-4 py-2 rounded mb-4"
                    >
                      {showAddressAccordion ? "Hide Address" : "Change Address"}
                    </button>

                    {showAddressAccordion && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold mb-1 uppercase">
                            Country / Region
                          </label>
                          <input
                            type="text"
                            disabled
                            value={shippingAddress.country}
                            className="border-2 border-customOrange rounded-md p-2 w-full bg-gray-100"
                          />

                          {shippingerrors.country && (
                            <p className="text-red-500 text-xs mt-1">
                              {shippingerrors.country}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1 uppercase">
                            State / County *
                          </label>
                          <select
                            value={shippingAddress.state}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                state: e.target.value,
                              })
                            }
                            className="border-2 border-customOrange rounded-md p-2 w-full"
                          >
                            <option value="">Select</option>
                            <option value="Kuala Lumpur">Kuala Lumpur</option>
                            <option value="Selangor">Selangor</option>
                          </select>

                          {shippingerrors.state && (
                            <p className="text-red-500 text-xs mt-1">
                              {shippingerrors.state}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1 uppercase">
                            Town / City *
                          </label>
                          <input
                            type="text"
                            value={shippingAddress.city}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                city: e.target.value,
                              })
                            }
                            className="border-2 border-customOrange rounded-md p-2 w-full"
                          />
                          {shippingerrors.city && (
                            <p className="text-red-500 text-xs mt-1">
                              {shippingerrors.city}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-bold mb-1 uppercase">
                            Apartment Unit *
                          </label>
                          <input
                            type="text"
                            value={shippingAddress.apartmentUnit}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                apartmentUnit: e.target.value,
                              })
                            }
                            className="border-2 border-customOrange rounded-md p-2 w-full"
                          />

                          {shippingerrors.apartmentUnit && (
                            <p className="text-red-500 text-xs mt-1">
                              {shippingerrors.apartmentUnit}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1 uppercase">
                            ZIP Code *
                          </label>
                          <input
                            type="text"
                            value={shippingAddress.zip}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                zip: e.target.value,
                              })
                            }
                            className="border-2 border-customOrange rounded-md p-2 w-full"
                          />

                          {shippingerrors.zip && (
                            <p className="text-red-500 text-xs mt-1">
                              {shippingerrors.zip}
                            </p>
                          )}
                        </div>
                        {/* Remarks Field */}
                        <div className="mb-4">
                          <label
                            htmlFor="remarks"
                            className="block font-bold text-xs pl-2 uppercase text-customGreen"
                          >
                            Remarks
                          </label>
                          <textarea
                            id="remarks"
                            name="remarks"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            rows={3}
                            placeholder="e.g. Leave at door, call upon arrival..."
                            className="border-2 border-customOrange rounded-md p-2 w-full resize-none"
                          />
                        </div>

                        <div className="space-y-6 max-w-md mx-auto">
                          <div>
                            <label className="block text-xs font-bold mb-1 uppercase">
                              Preferred Delivery Date *
                            </label>
                            <DatePicker
                              selected={selectedDate}
                              onChange={(date: Date | null) =>
                                setSelectedDate(date)
                              }
                              minDate={minSelectableDate}
                              dateFormat="EEE MMM dd yyyy"
                              placeholderText="Click to select a date"
                              className="w-full px-4 py-2 border border-customOrange rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:outline"
                            />
                          </div>

                          {shippingerrors.date && (
                            <p className="text-red-500 text-xs mt-1">
                              {shippingerrors.date}
                            </p>
                          )}

                          <div>
                            <label className="block text-xs font-bold mb-1 uppercase">
                              Preferred Delivery Time *
                            </label>
                            <select
                              value={selectedTimeSlot}
                              onChange={(e) =>
                                setSelectedTimeSlot(e.target.value)
                              }
                              className="w-full px-4 py-2 border border-customOrange rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                            >
                              <option value="" disabled>
                                Choose a time slot
                              </option>
                              {timeSlots.map((slot) => (
                                <option key={slot.value} value={slot.value}>
                                  {slot.label}
                                </option>
                              ))}
                            </select>

                            {shippingerrors.time && (
                              <p className="text-red-500 text-xs mt-1">
                                {shippingerrors.time}
                              </p>
                            )}
                          </div>

                          {selectedDate && selectedTimeSlot && (
                            <div className="p-4 bg-orange-50 rounded-lg border text-orange-800 font-medium">
                              Selected: {formatSelectedDate()} —{" "}
                              {
                                timeSlots.find(
                                  (slot) => slot.value === selectedTimeSlot
                                )?.label
                              }
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {shippingMethod === "pickup" && (
                  <div>
                    <button
                      onClick={() =>
                        setShowAddressAccordion(!showAddressAccordion)
                      }
                      className="bg-customOrange text-white font-bold px-4 py-2 rounded mb-4"
                    >
                      {showAddressAccordion ? "Hide Address" : "Change Address"}
                    </button>

                    {showAddressAccordion && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold mb-1 uppercase">
                            Country / Region
                          </label>
                          <input
                            type="text"
                            disabled
                            value="Malaysia"
                            className="border-2 border-customOrange rounded-md p-2 w-full bg-gray-100"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1 uppercase">
                            State / County *
                          </label>
                          <select
                            value={shippingAddress.state}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                state: e.target.value,
                              })
                            }
                            className="border-2 border-customOrange rounded-md p-2 w-full"
                          >
                            <option value="">Select</option>
                            <option value="Kuala Lumpur">Kuala Lumpur</option>
                            <option value="Selangor">Selangor</option>
                          </select>

                          {shippingerrors.state && (
                            <p className="text-red-500 text-xs mt-1">
                              {shippingerrors.state}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1 uppercase">
                            Town / City *
                          </label>
                          <input
                            type="text"
                            value={shippingAddress.city}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                city: e.target.value,
                              })
                            }
                            className="border-2 border-customOrange rounded-md p-2 w-full"
                          />

                          {shippingerrors.city && (
                            <p className="text-red-500 text-xs mt-1">
                              {shippingerrors.city}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1 uppercase">
                            ZIP Code *
                          </label>
                          <input
                            type="text"
                            value={shippingAddress.zip}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                zip: e.target.value,
                              })
                            }
                            className="border-2 border-customOrange rounded-md p-2 w-full"
                          />

                          {shippingerrors.zip && (
                            <p className="text-red-500 text-xs mt-1">
                              {shippingerrors.zip}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-bold mb-1 uppercase">
                            Where would you like to pick up? *
                          </label>
                          <select
                            value={shippingAddress.locations}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                locations: e.target.value,
                              })
                            }
                            className="border-2 border-customOrange rounded-md p-2 w-full"
                          >
                            <option value="">Place Select</option>
                            <option value="Fitnacle Subang Jaya">
                              Fitnacle Subang Jaya
                            </option>
                            <option value="Fitnacle Kota Kemuning">
                              Fitnacle Kota Kemuning
                            </option>

                            <option value="Fitnacle Seri Kembangan">
                              Fitnacle Seri Kembangan
                            </option>
                            <option value="USJ 21 BitesByte">
                              USJ 21 BitesByte
                            </option>
                          </select>

                          {shippingerrors.locations && (
                            <p className="text-red-500 text-xs mt-1">
                              {shippingerrors.locations}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="w-full md:w-[49%] border-2 border-customOrange rounded-md bg-white p-4 px-2 text-customOrange">
            <h5 className="mx-auto block text-center font-bold text-2xl mb-5">
              ORDER SUMMARY
            </h5>
            <div className="max-h-[485px] overflow-scroll">
              {cart.map((menu) => (
                <div key={menu.menu.id} className="h-[160px]">
                  <div className="flex justify-between py-4">
                    <div className="w-[25%] border-2 rounded-xl border-customOrange py-2">
                      <Image
                        src={`data:image/png;base64,${menu.menu.image}`}
                        alt={menu.menu.menuName}
                        className="w-full h-full object-cover"
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className="w-[68%] flex flex-col justify-between">
                      <div>
                        <h5 className="font-bold text-lg">
                          {menu.menu.menuName}
                        </h5>
                        <p className="text-sm text-customGray font-bold opacity-65">
                          {menu.menu.category}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-bold w-1/4">
                            RM {menu.menu.price}
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                if (menu.quantity > 1) {
                                  setCart((prev) =>
                                    prev.map((item) =>
                                      item.menu.id === menu.menu.id
                                        ? {
                                            ...item,
                                            quantity: item.quantity - 1,
                                          }
                                        : item
                                    )
                                  );
                                } else {
                                  setCart((prev) =>
                                    prev.filter(
                                      (item) => item.menu.id !== menu.menu.id
                                    )
                                  );
                                }
                              }}
                              className="px-2 py-1 border rounded text-customOrange"
                            >
                              –
                            </button>
                            <span>{menu.quantity}</span>
                            <button
                              onClick={() =>
                                setCart((prev) =>
                                  prev.map((item) =>
                                    item.menu.id === menu.menu.id
                                      ? { ...item, quantity: item.quantity + 1 }
                                      : item
                                  )
                                )
                              }
                              className="px-2 py-1 border rounded text-customOrange"
                            >
                              +
                            </button>
                            <button
                              onClick={() =>
                                setCart((prev) =>
                                  prev.filter(
                                    (item) => item.menu.id !== menu.menu.id
                                  )
                                )
                              }
                              className="px-2 py-1 border rounded text-red-500 hover:bg-red-100"
                              title="Remove Item"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-customGray font-bold opacity-65">
                          {menu.menu.totalCalories} KCAL
                        </p>
                      </div>
                    </div>
                  </div>
                  <hr className="border-customGray opacity-40" />
                </div>
              ))}
            </div>

            {/* Totals */}
            {cart.length > 0 && (
              <div className="flex flex-col items-end mt-4 border-t pt-4">
                <div className="text-customGray text-right w-full">
                  <p className="text-sm">
                    Receiving:{" "}
                    {shippingMethod === "delivery" ? "RM 6.00" : "Free"}
                  </p>
                  <p className="text-lg font-bold text-customOrange">
                    SUBTOTAL: RM {subtotal.toFixed(2)}
                  </p>
                  <p className="text-xl font-bold text-customGreen mt-2">
                    TOTAL: RM {totalPrice}
                  </p>
                  <p className="text-sm font-bold text-customGreen">
                    TOTAL CALORIES: {totalCalories} KCAL
                  </p>
                </div>

                <button
                  onClick={CLEARALL}
                  className="mt-3 bg-red-500 text-white px-4 py-1 rounded text-sm font-bold self-end"
                >
                  CLEAR ALL
                </button>

                {/* Payment Methods with Tabs */}
                <div className="w-full mt-6">
                  <div className="flex border-b border-customGray/20 mb-4">
                    <button
                      className={`px-4 py-2 font-medium ${
                        activePaymentTab === "card"
                          ? "text-customOrange border-b-2 border-customOrange"
                          : "text-customGray"
                      }`}
                      onClick={() => setActivePaymentTab("card")}
                    >
                      Card
                    </button>
                    <button
                      className={`px-4 py-2 font-medium ${
                        activePaymentTab === "cod"
                          ? "text-customOrange border-b-2 border-customOrange"
                          : "text-customGray"
                      }`}
                      onClick={() => setActivePaymentTab("cod")}
                    >
                      Cash on Delivery
                    </button>
                  </div>

                  {/* Card Payment */}
                  {activePaymentTab === "card" && (
                    <div className="py-4 space-y-4">
                      {user ? (
                        loadingPaymentInfo ? (
                          <div className="text-center py-4">
                            Loading payment methods...
                          </div>
                        ) : userPaymentInfo.length > 0 ? (
                          <>
                            <h3 className="font-medium text-customGray mb-2">
                              Saved Cards
                            </h3>
                            {userPaymentInfo.map((card) => (
                              <div
                                key={card.id}
                                className="flex items-center gap-3 p-4 bg-customBeige rounded-lg border border-customOrange"
                              >
                                <input
                                  type="radio"
                                  id={`card-${card.id}`}
                                  name="saved-card"
                                  checked={
                                    selectedPayment === `card-${card.id}`
                                  }
                                  onChange={() => {
                                    setSelectedPayment(`card-${card.id}`);
                                    setCardDetails({
                                      number: card.cardNo,
                                      expiry: card.expiryDate,
                                      cvv: card.cvv,
                                      isValid: true,
                                    });
                                  }}
                                  className="h-5 w-5 text-customOrange focus:ring-customGreen"
                                />
                                <label
                                  htmlFor={`card-${card.id}`}
                                  className="font-medium text-customGray"
                                >
                                  •••• •••• •••• {card.cardNo.slice(-4)} -
                                  Expires {card.expiryDate}
                                </label>
                              </div>
                            ))}
                            <div className="pt-2 border-t border-customGray/20">
                              <h3 className="font-medium text-customGray mb-2">
                                Or use a new card
                              </h3>
                              <CardInput
                                onSave={async () => {}}
                                onCardChange={(details) =>
                                  setCardDetails(details)
                                }
                                onCancel={() => {}}
                                showButtons={false}
                              />
                            </div>
                          </>
                        ) : (
                          <CardInput
                            onSave={async () => {}}
                            onCardChange={(details) => setCardDetails(details)}
                            onCancel={() => {}}
                            showButtons={false}
                          />
                        )
                      ) : (
                        <CardInput
                          onSave={async () => {}}
                          onCardChange={(details) => setCardDetails(details)}
                          onCancel={() => {}}
                          showButtons={false}
                        />
                      )}
                    </div>
                  )}

                  {/* Cash on Delivery */}
                  {activePaymentTab === "cod" && (
                    <div className="py-4">
                      <div className="flex items-center gap-3 p-4 bg-customBeige rounded-lg border border-customOrange">
                        <input
                          type="radio"
                          id="cod"
                          name="payment"
                          checked={selectedPayment === "cod"}
                          onChange={() => setSelectedPayment("cod")}
                          className="h-5 w-5 text-customOrange focus:ring-customGreen"
                        />
                        <label
                          htmlFor="cod"
                          className="font-medium text-customGray"
                        >
                          Pay with cash when you receive your order
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end w-full mt-2">
          <input
            type="button"
            className="bg-customGray font-bold text-white opacity-50 px-4 py-1 rounded mr-5 cursor-pointer text-sm"
            value="CANCEL"
            onClick={Cancel}
          />
          <input
            type="button"
            onClick={handleCheckout}
            className="bg-customGreen font-bold text-white px-4 py-1 rounded cursor-pointer text-sm"
            value="CHECKOUT"
          />
        </div>
      </div>

      {/* Modals */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="bg-white p-6 rounded-md shadow-md w-[300px] text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-red-500 mb-4">
              Missing Delivery Info
            </h2>
            <p className="text-sm text-gray-700">
              Please fill in all delivery address fields before checkout.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {successModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={closeSuccessModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="bg-white p-6 rounded-md shadow-md w-[90%] max-w-sm text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-green-600 mb-4">
              Order Successful
            </h2>
            <p className="text-sm text-gray-700">
              Thank you for your purchase! Your order has been placed
              successfully.
              <br />
              <span className="font-semibold text-black">
                Ref No: {orderReferenceNo}
              </span>
            </p>
            <button
              onClick={closeSuccessModal}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
