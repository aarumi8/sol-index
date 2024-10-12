
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAnchorProgram } from '@/hooks/useProgram';
import { PublicKey, Keypair, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { BN } from '@project-serum/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';

export const CreateTokenButton = () => {
  const program = useAnchorProgram();
  const { publicKey, connected } = useWallet();
  const [status, setStatus] = React.useState({ type: '', message: '' });

  const handleCreateToken = async () => {
    if (!program || !publicKey) {
      setStatus({ type: 'error', message: 'Program not initialized or wallet not connected.' });
      return;
    }

    try {
      setStatus({ type: 'info', message: 'Creating token...' });
      
      // Generate a new keypair for the mint token
      const mintKeypair = Keypair.generate();

      // Derive the Associated Token Account address for the new token
      const associatedTokenAccount = await getAssociatedTokenAddress(
        mintKeypair.publicKey,
        publicKey
      );

      // Call the createToken instruction
      const tx = await program.methods.createToken(
        8,  // decimals
        new BN(1000000)  // amount (adjust as needed)
      )
      .accounts({
        mintToken: mintKeypair.publicKey,
        signer: publicKey,
        tokenAccount: associatedTokenAccount,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associateTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .signers([mintKeypair])
      .rpc();

      console.log('Transaction signature', tx);
      setStatus({ type: 'success', message: `Token created successfully! Mint address: ${mintKeypair.publicKey.toString()}` });
    } catch (error) {
      console.error('Error creating token:', error);
      setStatus({ type: 'error', message: `Error creating token: ${error.message}` });
    }
  };

  return (
    <div className="space-y-4">
      <Button 
        onClick={handleCreateToken} 
        disabled={!connected}
      >
        Create Token
      </Button>
      {status.message && (
        <Alert variant={status.type === 'error' ? 'destructive' : 'default'}>
          <AlertTitle>{status.type === 'error' ? 'Error' : 'Status'}</AlertTitle>
          <AlertDescription>{status.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default CreateTokenButton;
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
      const amountInLamports = amountInSol * LAMPORTS_PER_SOL;

      // Calculate prioritization fee (0.01 SOL in lamports)
      const prioritizationFee = 0.01 * LAMPORTS_PER_SOL;

      // Step 1: Get quote
      const quoteResponse = await fetch(`${JUPITER_API_BASE}/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=${indexData.tokens[0].address}&amount=${amountInLamports.toString()}&slippageBps=50`)
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
          dynamicComputeUnitLimit: true, // allow dynamic compute limit
          prioritizationFeeLamports: prioritizationFee // fixed 0.01 SOL fee
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

      console.log(`Transaction confirmed: https://solscan.io/tx/${txid}`);

    } catch (err) {
      console.error('Transaction failed:', err);
      setError(`Failed to execute buy transaction: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return { buyIndex, isLoading, error };
};