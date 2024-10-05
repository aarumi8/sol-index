import React from 'react';
import Modal from './modal';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void;
}

export const BuyModal: React.FC<ActionModalProps> = ({ isOpen, onClose, onConfirm }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Buy Index"
    inputLabel="Enter amount to buy"
    buttonLabel="Confirm Buy"
    onConfirm={onConfirm}
  />
);