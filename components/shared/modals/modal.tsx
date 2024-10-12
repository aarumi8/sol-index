import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  inputLabel: string;
  buttonLabel: string;
  onConfirm: (value: string) => void;
  isProcessing?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  inputLabel,
  buttonLabel,
  onConfirm,
  isProcessing = false,
}) => {
  const [inputValue, setInputValue] = React.useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow only numbers and one decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setInputValue(value);
    }
  };

  const handleConfirm = () => {
    onConfirm(inputValue);
    setInputValue('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={isProcessing ? undefined : onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <label htmlFor="modalInput" className="block text-sm font-medium text-gray-700 mb-2">
            {inputLabel}
          </label>
          <Input
            id="modalInput"
            type='text'
            value={inputValue}
            onChange={handleChange}
            className="w-full"
            disabled={isProcessing}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleConfirm} disabled={isProcessing}>
            {buttonLabel}
          </Button>
        </DialogFooter>
        {isProcessing && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white">Processing transaction...</div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;