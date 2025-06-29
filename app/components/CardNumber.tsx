import React, { useState, ChangeEvent, useEffect, useRef } from "react";
import cardValidator from "card-validator";
import Image from "next/image";
type CardType = "visa" | "mastercard" | "amex" | null;

interface CardDetails {
  number: string;
  expiry: string;
  cvv: string;
  isValid: boolean;
}

interface Card extends CardDetails {
  id: number;
}

interface CardInputProps {
  onCardChange?: (details: CardDetails) => void; // Optional real-time updates
  onSave: (card: Omit<Card, "isValid">) => Promise<void>; // Final submission
  onCancel: () => void;
  showButtons?: boolean;
  initialData?: Omit<Card, "isValid">;
  isSubmitting?: boolean;
}

const CardInput: React.FC<CardInputProps> = ({
  onCardChange,
  onSave,
  onCancel,
  showButtons = true,
  initialData,
  isSubmitting = false,
}) => {
  const formatCardNumber = (number: string) => {
    const cleaned = number.replace(/\D/g, "");
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(" ").trim() : "";
  };

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardType, setCardType] = useState<CardType>(null);
  const [errors, setErrors] = useState({
    card: false,
    expiry: false,
    cvv: false,
  });

  // Use ref to store previous card details for comparison
  const prevDetailsRef = useRef<CardDetails>({
    number: "",
    expiry: "",
    cvv: "",
    isValid: false,
  });

  // Initialize with initialData if provided
  useEffect(() => {
    if (initialData) {
      setCardNumber(formatCardNumber(initialData.number));
      setExpiry(initialData.expiry || "");
      setCvv(initialData.cvv || "");

      const validation = cardValidator.number(initialData.number);
      const type = validation.card?.type;
      setCardType(
        type === "visa" || type === "mastercard" || type === "amex"
          ? (type as CardType)
          : null
      );
    }
  }, [initialData]);

  // Call onCardChange when details change (if provided)
  useEffect(() => {
    const rawNumber = cardNumber.replace(/\s/g, "");
    const isCardValid = cardValidator.number(rawNumber).isValid;
    const isExpiryValid = cardValidator.expirationDate(expiry).isValid;
    const isCvvValid = cardValidator.cvv(
      cvv,
      cardType === "amex" ? 4 : 3
    ).isValid;

    const currentDetails = {
      number: rawNumber,
      expiry: expiry.replace(/\D/g, ""),
      cvv,
      isValid: isCardValid && isExpiryValid && isCvvValid,
    };

    // Compare with previous details to avoid unnecessary updates
    if (
      currentDetails.number !== prevDetailsRef.current.number ||
      currentDetails.expiry !== prevDetailsRef.current.expiry ||
      currentDetails.cvv !== prevDetailsRef.current.cvv ||
      currentDetails.isValid !== prevDetailsRef.current.isValid
    ) {
      prevDetailsRef.current = currentDetails;
      if (onCardChange) {
        onCardChange(currentDetails);
      }
    }
  }, [cardNumber, expiry, cvv, cardType, onCardChange]);

  const handleCardInput = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    const formatted = formatCardNumber(raw);
    setCardNumber(formatted);

    const validation = cardValidator.number(raw);
    const type = validation.card?.type;

    setCardType(
      type === "visa" || type === "mastercard" || type === "amex"
        ? (type as CardType)
        : null
    );
    setErrors((prev) => ({
      ...prev,
      card: !validation.isValid && raw.length > 0,
    }));
  };

  const handleExpiryInput = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    let formatted = raw;
    if (raw.length > 2) {
      formatted = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setExpiry(formatted);

    const validation = cardValidator.expirationDate(formatted);
    setErrors((prev) => ({
      ...prev,
      expiry: !validation.isValid && raw.length === 4,
    }));
  };

  const handleCvvInput = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
      .replace(/\D/g, "")
      .slice(0, cardType === "amex" ? 4 : 3);
    setCvv(raw);

    const validation = cardValidator.cvv(raw, cardType === "amex" ? 4 : 3);
    setErrors((prev) => ({
      ...prev,
      cvv: !validation.isValid && raw.length === (cardType === "amex" ? 4 : 3),
    }));
  };

  const getCardLogo = (type: CardType): string | null => {
    switch (type) {
      case "visa":
        return "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png";
      case "mastercard":
        return "https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png";
      case "amex":
        return "https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.png";
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    const rawNumber = cardNumber.replace(/\s/g, "");
    const isCardValid = cardValidator.number(rawNumber).isValid;
    const isExpiryValid = cardValidator.expirationDate(expiry).isValid;
    const isCvvValid = cardValidator.cvv(
      cvv,
      cardType === "amex" ? 4 : 3
    ).isValid;

    setErrors({
      card: !isCardValid,
      expiry: !isExpiryValid,
      cvv: !isCvvValid,
    });

    if (isCardValid && isExpiryValid && isCvvValid) {
      await onSave({
        id: initialData?.id || -1, // Temporary ID for new cards
        number: rawNumber,
        expiry: expiry.replace(/\D/g, ""),
        cvv,
      });
    }
  };

  return (
    <div className="max-w-md mx-auto border-2 border-customOrange rounded-xl shadow-sm p-6 space-y-6">
      <h2 className="text-xl font-semibold text-customGreen">
        {initialData ? "Edit Card" : "Add New Card"}
      </h2>

      {/* Card Number Input */}
      <div className="relative">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Card Number
        </label>
        <div className="relative">
          <input
            type="text"
            value={cardNumber}
            onChange={handleCardInput}
            maxLength={cardType === "amex" ? 17 : 19}
            placeholder={
              cardType === "amex" ? "3782 822463 10005" : "1234 5678 9012 3456"
            }
            className={`w-full px-4 py-2 pr-14 text-customGray border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              errors.card ? "border-red-500" : "border-customOrange"
            }`}
          />
          {cardType && (
            <Image
              src={getCardLogo(cardType)!}
              width={22}
              height={22}
              alt={cardType}
              className="absolute top-1/2 -translate-y-1/2 right-3 w-10 h-auto"
            />
          )}
        </div>
        {errors.card && (
          <p className="mt-1 text-sm text-red-500">Invalid card number</p>
        )}
      </div>

      {/* Expiry and CVV Inputs */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Expiration Date
          </label>
          <input
            type="text"
            value={expiry}
            onChange={handleExpiryInput}
            maxLength={5}
            placeholder="MM/YY"
            className={`w-full px-4 py-2 border text-customGray rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              errors.expiry ? "border-red-500" : "border-customOrange"
            }`}
          />
          {errors.expiry && (
            <p className="mt-1 text-sm text-red-500">
              Invalid expiry date (MM/YY)
            </p>
          )}
        </div>

        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            CVV {cardType === "amex" ? "(4 digits)" : "(3 digits)"}
          </label>
          <input
            type="text"
            value={cvv}
            onChange={handleCvvInput}
            maxLength={cardType === "amex" ? 4 : 3}
            placeholder={cardType === "amex" ? "1234" : "123"}
            className={`w-full px-4 py-2 text-customGray border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              errors.cvv ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.cvv && (
            <p className="mt-1 text-sm text-red-500">
              Invalid CVV ({cardType === "amex" ? "4 digits" : "3 digits"})
            </p>
          )}
        </div>
      </div>

      {showButtons && (
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting
              ? "Saving..."
              : initialData
              ? "Update Card"
              : "Save Card"}
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default CardInput;
