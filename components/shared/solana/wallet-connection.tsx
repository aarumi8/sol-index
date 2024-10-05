'use client';

import { FC, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button';

export const WalletConnection: FC = () => {
  const { publicKey, wallet, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  const handleConnectClick = useCallback(() => {
    if (!wallet) {
      setVisible(true);
    } else {
      disconnect();
    }
  }, [wallet, disconnect, setVisible]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Button
        onClick={handleConnectClick}
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        {publicKey ? 'Disconnect' : 'Connect'}
      </Button>
    </div>
  );
};