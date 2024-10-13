'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { 
  Connection, 
  PublicKey, 
  VersionedTransaction,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import { IndexData } from '@/types';

const JUPITER_API_BASE = 'https://quote-api.jup.ag/v6';

export const useSellIndex = () => {
  const { publicKey, signTransaction } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sellIndex = async (indexData: IndexData, amountOfIndexToSell: number) => {
    if (!publicKey || !signTransaction || !indexData) {
      throw new Error('Wallet not connected or index data not available');
    }

    setIsLoading(true);
    setError(null);

    try {
      const connection = new Connection('https://rpc.shyft.to?api_key=6olEWLVlW6-SpodQ', 'confirmed');

      // Calculate prioritization fee (0.01 SOL in lamports)
      const prioritizationFee = 0.01 * LAMPORTS_PER_SOL;

      for (const token of indexData.tokens) {
        // Calculate the value of this token in the index (in SOL)
        const tokenValueInIndex = indexData.price * (token.percentage / 100);
        
        // Calculate the amount of this token to sell
        const tokenAmountToSell = amountOfIndexToSell * (tokenValueInIndex / token.price);

        // Convert token amount to smallest unit (considering token decimals)
        const tokenDecimals =  9; // Default to 9 if not provided
        const tokenAmountInSmallestUnit = Math.floor(tokenAmountToSell * Math.pow(10, tokenDecimals));

        // Step 1: Get quote (swap token for SOL)
        const quoteResponse = await fetch(`${JUPITER_API_BASE}/quote?inputMint=${token.address}&outputMint=So11111111111111111111111111111111111111112&amount=${tokenAmountInSmallestUnit.toString()}&slippageBps=50`)
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

        console.log(`Transaction for selling ${token.address} confirmed: https://solscan.io/tx/${txid}`);
      }

      console.log('All sell transactions completed successfully');

    } catch (err) {
      console.error('Transaction failed:', err);
      setError(`Failed to execute sell transaction: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return { sellIndex, isLoading, error };
};