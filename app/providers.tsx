'use client';

import { SolanaWalletProvider } from "@/components/shared/contexts/solana-wallet-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SolanaWalletProvider>{children}</SolanaWalletProvider>;
}