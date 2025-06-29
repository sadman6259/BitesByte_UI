"use client";
import React, { useState, useEffect, useCallback } from "react";
import CardInput from "../../../components/CardNumber";
import { Pencil, Trash2, Plus } from "lucide-react";
import axios from "axios";
import { LoadingSpinner } from "../../../components/LoadingSpinner";

// Define all types at the top
type Card = {
  id: number;
  number: string;
  expiry: string;
  cvv: string;
};

interface ApiCard {
  id: number;
  cardNo: string;
  expiryDate: string;
  cvv: string;
}

interface UserResponse {
  id: number;
  // Add other user properties if needed
}

export default function MoneyPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const fetchUserAndCards = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) {
        throw new Error("User email not found");
      }

      const userResponse = await axios.get<UserResponse>(
        `${
          process.env.NEXT_PUBLIC_BITESBYTE_API_URL
        }/getuserbyemail?email=${encodeURIComponent(userEmail)}`
      );
      const fetchedUserId = userResponse.data.id;
      setUserId(fetchedUserId);

      const cardsResponse = await axios.get<ApiCard[]>(
        `${process.env.NEXT_PUBLIC_BITESBYTE_API_URL}/getuserpaymentinfolistbyuserid?userid=${fetchedUserId}`
      );

      const formattedCards = cardsResponse.data.map((card) => ({
        id: card.id,
        number: card.cardNo || "",
        expiry: card.expiryDate || "",
        cvv: card.cvv || "",
      }));

      setCards(formattedCards);
    } catch (err) {
      setError("Failed to load user data. Please refresh the page.");
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserAndCards();
  }, [fetchUserAndCards]);

  const handleAddOrEditCard = async (card: Card) => {
    if (!userId) {
      setError("User not identified. Please refresh the page.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (editingIndex !== null) {
        // Update existing card
        const cardToUpdate = cards[editingIndex];
        await axios.post(
          `${process.env.NEXT_PUBLIC_BITESBYTE_API_URL}/updateuserpaymentinfo`,
          {
            id: cardToUpdate.id,
            userId: userId,
            cardNo: card.number.replace(/\s/g, ""),
            cvv: card.cvv,
            expiryDate: card.expiry || null,
          }
        );

        const updatedCards = [...cards];
        updatedCards[editingIndex] = {
          ...card,
          id: cardToUpdate.id,
        };
        setCards(updatedCards);
      } else {
        // Add new card
        const response = await axios.post<{ id: number }>(
          `${process.env.NEXT_PUBLIC_BITESBYTE_API_URL}/insertuserpaymentinfo`,
          {
            userId: userId,
            cardNo: card.number.replace(/\s/g, ""),
            cvv: card.cvv,
            expiryDate: card.expiry || null,
          }
        );

        setCards([
          ...cards,
          {
            ...card,
            id: response.data.id,
          },
        ]);
      }
    } catch (err) {
      setError("Failed to save card. Please try again.");
      console.error("Error saving card:", err);
      return;
    } finally {
      setIsSubmitting(false);
      setEditingIndex(null);
      setShowForm(false);
    }
  };

  const handleRemoveCard = async (index: number) => {
    try {
      const cardToRemove = cards[index];
      await axios({
        method: "post",
        url: `${process.env.NEXT_PUBLIC_BITESBYTE_API_URL}/delteuserpaymentinfo`,
        data: cardToRemove.id,
        headers: {
          "Content-Type": "application/json",
        },
      });

      const updated = [...cards];
      updated.splice(index, 1);
      setCards(updated);

      if (editingIndex === index) {
        setEditingIndex(null);
        setShowForm(false);
      }
    } catch (err) {
      setError("Failed to delete card. Please try again.");
      console.error("Error deleting card:", err);
    }
  };

  const handleEditCard = (index: number) => {
    setEditingIndex(index);
    setShowForm(true);
  };

  const getCardType = (number: string) => {
    if (/^4/.test(number)) return "VISA";
    if (/^5[1-5]/.test(number)) return "MASTERCARD";
    if (/^3[47]/.test(number)) return "AMEX";
    return "CARD";
  };

  const refreshCards = async () => {
    setIsLoading(true);
    await fetchUserAndCards();
  };

  return (
    <div className="min-h-screen bg-customBeige p-6">
      <LoadingSpinner isLoading={isLoading || isSubmitting} />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-customGreen mb-2">
            My Payment Methods
          </h1>
          <div className="w-24 h-1 bg-customGreen mx-auto"></div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
            <button
              onClick={refreshCards}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              Retry
            </button>
          </div>
        )}

        {showForm && (
          <section className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-customGray">
                {editingIndex !== null ? "Edit Card" : "Add New Card"}
              </h2>
            </div>
            <CardInput
              onSave={handleAddOrEditCard}
              onCancel={() => {
                setEditingIndex(null);
                setShowForm(false);
              }}
              showButtons={true}
              initialData={
                editingIndex !== null ? cards[editingIndex] : undefined
              }
              isSubmitting={isSubmitting}
            />
          </section>
        )}

        <section className="my-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-customGray">
              Saved Cards
            </h2>
            <div className="flex gap-2">
              {!showForm && (
                <button
                  onClick={() => {
                    setEditingIndex(null);
                    setShowForm(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-customOrange text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <Plus size={18} />
                  Add New Card
                </button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <p className="text-customGray">Loading your cards...</p>
            </div>
          ) : cards.length === 0 && !showForm ? (
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <p className="text-customGray">
                You have not added any cards yet
              </p>
            </div>
          ) : null}

          <ul className="space-y-4">
            {cards.map((card, idx) => (
              <li
                key={card.id}
                className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow flex justify-between items-center"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-7 rounded flex items-center justify-center 
                    ${
                      getCardType(card.number) === "VISA"
                        ? "bg-blue-500/20 text-blue-800"
                        : getCardType(card.number) === "MASTERCARD"
                        ? "bg-red-500/20 text-red-800"
                        : "bg-customGreen/20 text-customGray"
                    }`}
                  >
                    {getCardType(card.number).charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-customGray">
                      •••• •••• •••• {card.number.slice(-4)}
                    </p>
                    {card.expiry && (
                      <p className="text-sm text-customGray">
                        Expires {card.expiry}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleEditCard(idx)}
                    className="p-2 text-customGray hover:text-customOrange rounded-full hover:bg-orange-50 transition-colors"
                    aria-label="Edit card"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleRemoveCard(idx)}
                    className="p-2 text-customGray hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                    aria-label="Remove card"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
