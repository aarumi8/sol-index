import React from 'react';
import Modal from './modal';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void;
}

export const RedeemModal: React.FC<ActionModalProps> = ({ isOpen, onClose, onConfirm }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Redeem Index"
    inputLabel="Enter amount to redeem"
    buttonLabel="Confirm Redeem"
    onConfirm={onConfirm}
  />
);