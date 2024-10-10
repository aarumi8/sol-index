
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