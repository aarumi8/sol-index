'use server';

import { createIndexSchema, CreateIndexFormData } from "@/constants/create-index-form-schema";
import { PrismaClient } from '@prisma/client';
import { Connection, PublicKey } from '@solana/web3.js';

const prisma = new PrismaClient();
const connection = new Connection('https://koo-jpnlrt-fast-mainnet.helius-rpc.com');


async function checkTokenExistsOnSolana(address: string): Promise<boolean> {
  try {
    const publicKey = new PublicKey(address);
    const accountInfo = await connection.getAccountInfo(publicKey);

    if (!accountInfo) {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }

  return true;
}

export async function createIndex(data: CreateIndexFormData) {
  const result = createIndexSchema.safeParse(data);

  if (!result.success) {
    return { success: false, error: 'Invalid form data', details: result.error.flatten().fieldErrors };
  }

  // Check if all tokens exist on Solana
  const tokenChecks = await Promise.all(
    result.data.tokens.map(token => checkTokenExistsOnSolana(token.address))
  );

  if (tokenChecks.some(check => !check)) {
    return { success: false, error: 'One or more tokens do not exist on Solana' };
  }

  // Check if total percentage is not higher than 100
  const totalPercentage = result.data.tokens.reduce((sum, token) => sum + token.percentage, 0);
  if (totalPercentage > 100) {
    return { success: false, error: 'Total percentage exceeds 100%' };
  }

  try {
    // Create the index
    const newIndex = await prisma.index.create({
      data: {
        address: new PublicKey(Math.random() * 1e9).toBase58(), // Generate a random address for demo purposes
        name: result.data.indexName,
        ticker: result.data.indexTicker,
        price: 0, // Initial price, you might want to calculate this based on token prices
        tokens: {
          create: await Promise.all(result.data.tokens.map(async (tokenData) => {
            // Check if the token already exists in the database
            let token = await prisma.token.findUnique({
              where: { address: tokenData.address }
            });

            // If the token doesn't exist, create it with dummy data
            if (!token) {
              token = await prisma.token.create({
                data: {
                  address: tokenData.address,
                  name: `Token ${tokenData.address.slice(0, 8)}`, // Dummy name
                  ticker: `T${tokenData.address.slice(0, 3)}`, // Dummy ticker
                  mcap: 0, // Dummy market cap
                  price: 1, // Dummy price
                }
              });
            }

            // Create the TokenInIndex relation
            return {
              token: {
                connect: { id: token.id }
              },
              percentage: tokenData.percentage
            };
          }))
        }
      }
    });

    return { success: true, message: 'Index created successfully', index: newIndex };
  } catch (error) {
    console.error('Error creating index:', error);
    return { success: false, error: 'Failed to create index in the database' };
  }
}