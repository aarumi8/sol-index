import React, { useState } from 'react';
import Modal from './modal';
import { useIndexStore } from '@/store/useIndexStore';
import { useSellIndex } from '@/hooks/useSellIndex';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SellModal: React.FC<ActionModalProps> = ({ isOpen, onClose }) => {
  const { indexData } = useIndexStore();
  const { sellIndex, isLoading, error } = useSellIndex();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async (value: string) => {
    if (indexData) {
      setIsProcessing(true);
      try {
        await sellIndex(indexData, parseFloat(value));
        alert('Transaction successful!');
      } catch (err) {
        alert(error || 'An error occurred');
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
      title={`Sell ${indexData?.name || 'Index'}`}
      inputLabel={`Enter amount to sell (Current price: ${indexData?.price || 'N/A'})`}
      buttonLabel={isLoading || isProcessing ? "Processing..." : "Confirm Sell"}
      onConfirm={handleConfirm}
      isProcessing={isProcessing}
    />
  );
};