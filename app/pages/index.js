"use client";
import React, { useState } from "react";
import Modal from "../components/Modal";
import HomeSection from "../components/HomeSection";
import PlansModal from "../components/PlansModal";

export default function Homepage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, setCalcResultModalOpen] = useState(false);
  const [planModalOpen, setPlanModalOpen] = useState(false);

  return (
    <div>
      <HomeSection isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setPlanModalOpen={setPlanModalOpen}
        setCalcResultModalOpen={setCalcResultModalOpen}
      />

      {planModalOpen && (
        <PlansModal
          planModalOpen={planModalOpen}
          setPlanModalOpen={setPlanModalOpen}
        />
      )}
    </div>
  );
}
