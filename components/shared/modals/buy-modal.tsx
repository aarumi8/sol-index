import React, { useState } from 'react';
import Modal from './modal';
import { useIndexStore } from '@/store/useIndexStore';
import { useBuyIndex } from '@/hooks/useBuyIndex';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BuyModal: React.FC<ActionModalProps> = ({ isOpen, onClose }) => {
  const { indexData } = useIndexStore();
  const { buyIndex, isLoading, error } = useBuyIndex();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async (value: string) => {
    if (indexData) {
      setIsProcessing(true);
      try {
        await buyIndex(indexData, parseFloat(value));
        alert('Transaction successful!');
      } catch (err) {
        alert(error || 'An error occurred');
        console.log(err);
      } finally {
        setIsProcessing(false);
        onClose();
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Buy ${indexData?.name || 'Index'}`}
      inputLabel={`Enter amount to buy in SOL (Current price: ${indexData?.price || 'N/A'})`}
      buttonLabel={isLoading || isProcessing ? "Processing..." : "Confirm Buy"}
      onConfirm={handleConfirm}
      isProcessing={isProcessing}
    />
  );
};