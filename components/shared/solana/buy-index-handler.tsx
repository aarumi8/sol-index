import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import axios from 'axios';
import { useIndexStore } from '@/store/useIndexStore';
import { Button } from '@/components/ui/button';

const JUPITER_API_BASE = 'https://quote-api.jup.ag/v4';

interface Quote {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: 'ExactIn' | 'ExactOut';
  slippageBps: number;
  platformFee?: { amount: string; feeBps: number };
  priceImpactPct: string;
  routePlan: any[];
  swapInfo: any;
}

interface BuyIndexHandlerProps {
  amount: string;
  onComplete: () => void;
}

export const BuyIndexHandler: React.FC<BuyIndexHandlerProps> = ({ amount, onComplete }) => {
  const { publicKey, signTransaction } = useWallet();
  const { indexData } = useIndexStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (amount) {
      handleBuy();
    }
  }, [amount]);

  const handleBuy = async () => {
    if (!publicKey || !signTransaction || !indexData || !amount) {
      setError('Wallet not connected, index data not available, or amount not specified');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Get quotes for each token to SOL
      const quotes: Quote[] = await Promise.all(
        indexData.tokens.map(token =>
          getQuote(new PublicKey(token.address), new PublicKey('So11111111111111111111111111111111111111112'), parseFloat(amount) * (token.percentage / 100))
        )
      );

      // Step 2: Create a combined transaction
      const { swapTransaction } = await getCombinedTransaction(quotes);

      // Step 3: Send transaction via wallet
      const transaction = Transaction.from(Buffer.from(swapTransaction, 'base64'));
      const signedTransaction = await signTransaction(transaction);
      const connection = new Connection('https://api.mainnet-beta.solana.com');
      const txid = await connection.sendRawTransaction(signedTransaction.serialize());

      console.log('Transaction sent:', txid);
      onComplete();
    } catch (err) {
      setError('Failed to execute buy transaction');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getQuote = async (inputMint: PublicKey, outputMint: PublicKey, amount: number): Promise<Quote> => {
    const response = await axios.get(`${JUPITER_API_BASE}/quote`, {
      params: {
        inputMint: inputMint.toBase58(),
        outputMint: outputMint.toBase58(),
        amount: amount,
        slippageBps: 50,
      },
    });
    return response.data;
  };

  const getCombinedTransaction = async (quotes: Quote[]) => {
    const response = await axios.post(`${JUPITER_API_BASE}/swap`, {
      quoteResponse: quotes,
      userPublicKey: publicKey!.toBase58(),
    });
    return response.data;
  };

  if (isLoading) {
    return <p>Processing transaction...</p>;
  }

  if (error) {
    return (
      <div>
        <p className="text-red-500">{error}</p>
        <Button onClick={onComplete}>Close</Button>
      </div>
    );
  }

  return null;
};