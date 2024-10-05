import React from 'react';
import Modal from './modal';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void;
}

export const SellModal: React.FC<ActionModalProps> = ({ isOpen, onClose, onConfirm }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Sell Index"
    inputLabel="Enter amount to sell"
    buttonLabel="Confirm Sell"
    onConfirm={onConfirm}
  />
);