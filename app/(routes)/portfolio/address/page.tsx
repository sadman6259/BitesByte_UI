"use client";
import React, { useState, ChangeEvent, useEffect, useCallback } from "react";
import {
  Home,
  MapPin,
  Edit,
  Trash2,
  Star,
  Plus,
  X,
  AlertCircle,
  Check,
  Loader2,
  Briefcase,
  Phone,
  Building2,
} from "lucide-react";
import axios from "axios";

interface Address {
  id: number;
  userId: number;
  addressType: string;
  street: string;
  apartmentUnit: string;
  city: string;
  state: string;
  postCode: string;
  phone: string;
  isDefaultAddress: boolean;
}

const AddressPage: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [form, setForm] = useState<
    Omit<Address, "id" | "userId"> & { id: number }
  >({
    id: 0,
    addressType: "Home",
    street: "",
    apartmentUnit: "",
    city: "",
    state: "",
    postCode: "",
    phone: "",
    isDefaultAddress: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserAndAddresses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) {
        throw new Error("User email not found");
      }

      const userResponse = await axios.get(
        `${
          process.env.NEXT_PUBLIC_BITESBYTE_API_URL
        }/getuserbyemail?email=${encodeURIComponent(userEmail)}`
      );
      const fetchedUserId = userResponse.data.id;
      setUserId(fetchedUserId);

      const addressesResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_BITESBYTE_API_URL}/getuseraddresslistbyuserid?userid=${fetchedUserId}`
      );

      // Sort addresses so default comes first
      const sortedAddresses = [...addressesResponse.data].sort((a, b) => {
        if (a.isDefaultAddress) return -1;
        if (b.isDefaultAddress) return 1;
        return 0;
      });

      setAddresses(sortedAddresses);
    } catch (err) {
      setError("Failed to load addresses. Please refresh the page.");
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserAndAddresses();
  }, [fetchUserAndAddresses]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      id: 0,
      addressType: "Home",
      street: "",
      apartmentUnit: "",
      city: "",
      state: "",
      postCode: "",
      phone: "",
      isDefaultAddress: false,
    });
    setIsEditing(false);
    setShowForm(false);
    setError("");
    setSuccess("");
  };

  const validateForm = () => {
    if (!form.street.trim()) {
      setError("Street address is required");
      return false;
    }
    if (!form.city.trim()) {
      setError("City is required");
      return false;
    }
    if (!form.state.trim()) {
      setError("State is required");
      return false;
    }
    if (!form.postCode.trim()) {
      setError("Post code is required");
      return false;
    }
    if (!form.phone.trim()) {
      setError("Phone number is required");
      return false;
    }
    if (!/^\d+$/.test(form.phone)) {
      setError("Phone number should contain only digits");
      return false;
    }
    return true;
  };

  const handleAddOrEdit = async () => {
    if (!validateForm()) return;

    if (!userId) {
      setError("User not identified. Please refresh the page.");
      return;
    }

    try {
      setIsLoading(true);
      if (isEditing) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BITESBYTE_API_URL}/updateuseraddress`,
          {
            ...form,
            userId: userId,
          }
        );
        setSuccess("Address updated successfully");
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BITESBYTE_API_URL}/insertuseraddress`,
          {
            ...form,
            userId: userId,
            isDefaultAddress: addresses.length === 0 || form.isDefaultAddress,
          }
        );
        setSuccess("Address added successfully");
      }
      await fetchUserAndAddresses();
      setTimeout(() => resetForm(), 1500);
    } catch (err) {
      setError("Failed to save address. Please try again.");
      console.error("Error saving address:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (id: number) => {
    try {
      setIsLoading(true);
      await axios({
        method: "post",
        url: `${process.env.NEXT_PUBLIC_BITESBYTE_API_URL}/delteuseraddress`,
        data: id,
        headers: {
          "Content-Type": "application/json",
        },
      });
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
      setSuccess("Address deleted successfully");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError("Failed to delete address. Please try again.");
      console.error("Error deleting address:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (addr: Address) => {
    setForm(addr);
    setIsEditing(true);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleSetDefault = async (id: number) => {
    if (!userId) {
      setError("User not identified");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BITESBYTE_API_URL}/getdefaultuseraddressbyuserid`,
        {
          params: {
            userId: userId,
            addressId: id,
          },
        }
      );

      if (response.data.success) {
        setSuccess("Default address updated successfully");
        await fetchUserAndAddresses(); // Refresh the list
      } else {
        setError(response.data.message || "Failed to set default address");
      }
    } catch (err) {
      setError("Failed to set default address. Please try again.");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setError("");
    setSuccess("");
  };

  const refreshAddresses = async () => {
    setIsLoading(true);
    setError("");
    await fetchUserAndAddresses();
  };

  const getAddressTypeIcon = (type: string) => {
    switch (type) {
      case "Home":
        return <Home size={18} className="text-customOrange" />;
      case "Work":
        return <MapPin size={18} className="text-blue-500" />;
      default:
        return <MapPin size={18} className="text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-customBeige p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-customGreen mb-2 flex items-center justify-center gap-2">
            <MapPin size={28} />
            My Addresses
          </h1>
          <p className="text-gray-600 mb-4">Manage your delivery addresses</p>
          <div className="w-24 h-1 bg-customGreen mx-auto"></div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
            <button
              onClick={refreshAddresses}
              className="ml-auto text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              Retry
            </button>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
            <Check size={20} />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-customGray flex items-center gap-2">
                <MapPin className="text-customOrange" />
                {isEditing ? "Edit Address" : "Add New Address"}
              </h2>
              <button
                onClick={toggleForm}
                className="p-1 text-customGray hover:text-customOrange rounded-full hover:bg-orange-50 transition-colors"
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-customGray flex items-center gap-1">
                  Address Type
                </label>
                <div className="relative">
                  <select
                    name="addressType"
                    value={form.addressType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-customOrange focus:border-customOrange text-customGray appearance-none bg-white"
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-customGray flex items-center gap-1">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="street"
                  value={form.street}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-customOrange focus:border-customOrange text-customGray"
                  placeholder="123 Main St"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-customGray flex items-center gap-1">
                  Apartment/Unit (Optional)
                </label>
                <input
                  type="text"
                  name="apartmentUnit"
                  value={form.apartmentUnit}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-customOrange focus:border-customOrange text-customGray"
                  placeholder="Apt 4B"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-customGray flex items-center gap-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-customOrange focus:border-customOrange text-customGray"
                  placeholder="New York"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-customGray flex items-center gap-1">
                  State/Province <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-customOrange focus:border-customOrange text-customGray"
                  placeholder="NY"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-customGray flex items-center gap-1">
                  Postal Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="postCode"
                  value={form.postCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-customOrange focus:border-customOrange text-customGray"
                  placeholder="10001"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-customGray flex items-center gap-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-customOrange focus:border-customOrange text-customGray"
                  placeholder="1234567890"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isDefaultAddress"
                  id="isDefaultAddress"
                  checked={form.isDefaultAddress}
                  onChange={(e) =>
                    setForm({ ...form, isDefaultAddress: e.target.checked })
                  }
                  className="h-4 w-4 text-customOrange focus:ring-customOrange border-gray-300 rounded"
                />
                <label
                  htmlFor="isDefaultAddress"
                  className="text-sm font-medium text-customGray"
                >
                  Set as default address
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-2">
              <button
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <X size={18} /> Cancel
              </button>
              <button
                onClick={handleAddOrEdit}
                disabled={isLoading}
                className="px-4 py-2 bg-customOrange text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Processing...
                  </>
                ) : isEditing ? (
                  <>
                    <Check size={18} /> Save Changes
                  </>
                ) : (
                  <>
                    <Plus size={18} /> Add Address
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Address List */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-customGray flex items-center gap-2">
              <Home className="text-customOrange" />
              Your Addresses
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({addresses.length} saved)
              </span>
            </h2>
            {!showForm && (
              <button
                onClick={toggleForm}
                className="flex items-center gap-2 px-4 py-2 bg-customOrange text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Plus size={18} />
                Add New Address
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="bg-white p-6 rounded-xl shadow-sm text-center flex flex-col items-center justify-center gap-3">
              <Loader2 size={24} className="animate-spin text-customOrange" />
              <p className="text-customGray">Loading your addresses...</p>
            </div>
          ) : addresses.length === 0 && !showForm ? (
            <div className="bg-white p-6 rounded-xl shadow-sm text-center flex flex-col items-center gap-4">
              <MapPin size={48} className="text-gray-300" />
              <h3 className="text-lg font-medium text-gray-700">
                No addresses saved yet
              </h3>
              <p className="text-gray-500 mb-4">
                Add your first address to get started
              </p>
              <button
                onClick={toggleForm}
                className="flex items-center gap-2 px-4 py-2 bg-customOrange text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Plus size={18} />
                Add Address
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {addresses.map((addr) => (
                <li
                  key={addr.id}
                  className={`bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all ${
                    addr.isDefaultAddress
                      ? "border-2 border-customGreen"
                      : "border border-gray-100"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        {addr.addressType === "Home" ? (
                          <Home size={18} className="text-customOrange" />
                        ) : addr.addressType === "Work" ? (
                          <Briefcase size={18} className="text-blue-500" />
                        ) : (
                          <MapPin size={18} className="text-gray-500" />
                        )}
                        <p className="font-medium text-customGray">
                          {addr.addressType} Address
                        </p>
                        {addr.isDefaultAddress && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-customGreen/20 text-customGreen rounded-full">
                            <Star size={12} /> Default
                          </span>
                        )}
                      </div>
                      <div className="pl-8 space-y-1">
                        <p className="text-gray-700 flex items-start gap-2">
                          <MapPin
                            size={14}
                            className="mt-0.5 flex-shrink-0 text-gray-400"
                          />
                          <span>
                            {addr.street}
                            {addr.apartmentUnit && `, ${addr.apartmentUnit}`}
                          </span>
                        </p>
                        <p className="text-gray-700 flex items-start gap-2">
                          <Building2
                            size={14}
                            className="mt-0.5 flex-shrink-0 text-gray-400"
                          />
                          <span>
                            {addr.city}, {addr.state} {addr.postCode}
                          </span>
                        </p>
                        <p className="text-gray-700 flex items-center gap-2">
                          <Phone
                            size={14}
                            className="flex-shrink-0 text-gray-400"
                          />
                          <span>{addr.phone}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end md:justify-normal">
                      {/* {!addr.isDefaultAddress && (
                        <button
                          onClick={() => handleSetDefault(addr.id)}
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                          title="Set as default"
                        >
                          <Star size={14} />
                          <span className="md:hidden">Default</span>
                        </button>
                      )} */}
                      <button
                        onClick={() => handleEdit(addr)}
                        className="p-2 text-gray-500 hover:text-customOrange rounded-full hover:bg-orange-50 transition-colors"
                        aria-label="Edit address"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleRemove(addr.id)}
                        className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                        aria-label="Remove address"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressPage;
