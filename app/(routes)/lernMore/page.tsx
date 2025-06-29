"use client";
import React, { useState } from "react";
import LearnMore from "../../components/LearnMore";
import Modal from "../../components/Modal";
import PlansModal from "../../components/PlansModal";

export default function LearnMorePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [calcResultModalOpen, setCalcResultModalOpen] = useState(false);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  return (
    <>
      <LearnMore setIsModalOpen={setIsModalOpen} />;
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setPlanModalOpen={setPlanModalOpen}
        setCalcResultModalOpen={setCalcResultModalOpen}
      />
      <p className="hidde">{calcResultModalOpen}</p>
      {planModalOpen && (
        <PlansModal
          planModalOpen={planModalOpen}
          setPlanModalOpen={setPlanModalOpen}
        />
      )}
    </>
  ); // If needed
}
