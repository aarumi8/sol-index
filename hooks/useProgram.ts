import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, Idl } from '@project-serum/anchor';
import { useMemo } from 'react';
import idl from '@/app/assets/idl.json'

const programId = new PublicKey('Aw4Fg4ceJ6WdNHweEdFfNA6ynyc2Kh33kkkzHMF19W4s');

export function useAnchorProgram() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const provider = useMemo(() => {
    if (!wallet) return null;
    return new AnchorProvider(connection, wallet, {});
  }, [connection, wallet]);

  const program = useMemo(() => {
    if (!provider) return null;
    return new Program(idl as Idl, programId, provider);
  }, [provider]);

  return program;
}