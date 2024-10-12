import React from 'react';
import Modal from './modal';
import { useIndexStore } from '@/store/useIndexStore';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void;
}

export const BuyModal: React.FC<ActionModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const { indexData } = useIndexStore(); // Use the Zustand store

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Buy ${indexData?.name || 'Index'}`}
      inputLabel={`Enter amount to buy (Current price: ${indexData?.price || 'N/A'})`}
      buttonLabel="Confirm Buy"
      onConfirm={onConfirm}
    />
  );
};