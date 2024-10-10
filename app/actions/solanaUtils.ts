import { Connection, PublicKey } from '@solana/web3.js';

const connection = new Connection('https://koo-jpnlrt-fast-mainnet.helius-rpc.com');

export async function checkTokenExistsOnSolana(address: string): Promise<boolean> {
  try {
    const publicKey = new PublicKey(address);
    const accountInfo = await connection.getAccountInfo(publicKey);
    return !!accountInfo;
  } catch (error) {
    console.error(error);
    return false;
  }
}