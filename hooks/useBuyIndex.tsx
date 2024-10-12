'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { 
  Connection, 
  PublicKey, 
  VersionedTransaction,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';

const JUPITER_API_BASE = 'https://quote-api.jup.ag/v6';

export const useBuyIndex = () => {
  const { publicKey, signTransaction } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buyIndex = async (indexData: any, amountInSol: number) => {
    if (!publicKey || !signTransaction || !indexData) {
      throw new Error('Wallet not connected or index data not available');
    }

    setIsLoading(true);
    setError(null);

    try {
      const connection = new Connection('https://rpc.shyft.to?api_key=6olEWLVlW6-SpodQ', 'confirmed');

      // Convert SOL to lamports
      const totalAmountInLamports = amountInSol * LAMPORTS_PER_SOL;

      // Calculate prioritization fee (0.01 SOL in lamports)
      const prioritizationFee = 0.01 * LAMPORTS_PER_SOL;

      for (const token of indexData.tokens) {
        // Calculate amount for this token based on percentage
        const tokenAmountInLamports = Math.floor(totalAmountInLamports * (token.percentage / 100));

        // Step 1: Get quote
        const quoteResponse = await fetch(`${JUPITER_API_BASE}/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=${token.address}&amount=${tokenAmountInLamports.toString()}&slippageBps=50`)
          .then(res => res.json());

        // Step 2: Get swap transaction with fixed prioritization fee
        const swapResponse = await fetch(`${JUPITER_API_BASE}/swap`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            quoteResponse,
            userPublicKey: publicKey.toBase58(),
            wrapAndUnwrapSol: true,
            dynamicComputeUnitLimit: true,
            prioritizationFeeLamports: prioritizationFee
          })
        }).then(res => res.json());

        // Step 3: Deserialize the transaction
        const swapTransactionBuf = Buffer.from(swapResponse.swapTransaction, 'base64');
        const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

        // Step 4: Sign the transaction
        const signedTransaction = await signTransaction(transaction);

        // Step 5: Send the transaction
        const rawTransaction = signedTransaction.serialize()
        const txid = await connection.sendRawTransaction(rawTransaction, {
          skipPreflight: true,
          maxRetries: 3
        });

        // Step 6: Confirm the transaction
        const latestBlockHash = await connection.getLatestBlockhash();
        await connection.confirmTransaction({
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: txid
        });

        console.log(`Transaction for ${token.address} confirmed: https://solscan.io/tx/${txid}`);
      }

      console.log('All transactions completed successfully');

    } catch (err) {
      console.error('Transaction failed:', err);
      setError(`Failed to execute buy transaction: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return { buyIndex, isLoading, error };
};