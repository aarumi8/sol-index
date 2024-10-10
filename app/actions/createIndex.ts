'use server';

import { createIndexSchema, CreateIndexFormData } from "@/constants/create-index-form-schema";
import { PrismaClient } from '@prisma/client';
import { PublicKey } from '@solana/web3.js';
import { checkTokenExistsOnSolana } from "./solanaUtils";
import { getTokenData, getTokenPrice } from "./tokenUtils";

const prisma = new PrismaClient();

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
        price: 0, // Initial price, will be calculated later
        tokens: {
          create: await Promise.all(result.data.tokens.map(async (tokenData) => {
            const tokenInfo = await getTokenData(tokenData.address);
            const tokenPrice = await getTokenPrice(tokenData.address);

            // Check if the token already exists in the database
            let token = await prisma.token.findUnique({
              where: { address: tokenData.address }
            });

            if (token) {
              // Update existing token with new data
              token = await prisma.token.update({
                where: { id: token.id },
                data: {
                  name: tokenInfo?.name || token.name,
                  ticker: tokenInfo?.symbol || token.ticker,
                  imageURL: tokenInfo?.logoURI || token.imageURL,
                  price: tokenPrice || token.price,
                  mcap: 0, // Market cap is still set to 0 as we don't have this data
                }
              });
            } else {
              // Create new token with fetched data
              token = await prisma.token.create({
                data: {
                  address: tokenData.address,
                  name: tokenInfo?.name || `Token ${tokenData.address.slice(0, 8)}`,
                  ticker: tokenInfo?.symbol || `T${tokenData.address.slice(0, 3)}`,
                  imageURL: tokenInfo?.logoURI || null,
                  mcap: 0,
                  price: tokenPrice || 1,
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
      },
      include: { tokens: { include: { token: true } } }
    });

    // Calculate the initial price of the index based on token prices and percentages
    const indexPrice = newIndex.tokens.reduce((sum, tokenInIndex) => {
      return sum + (tokenInIndex.token.price || 0) * (tokenInIndex.percentage / 100);
    }, 0);

    // Update the index with the calculated price
    const updatedIndex = await prisma.index.update({
      where: { id: newIndex.id },
      data: { price: indexPrice },
      include: { tokens: { include: { token: true } } }
    });

    return { success: true, message: 'Index created successfully', index: updatedIndex };
  } catch (error) {
    console.error('Error creating index:', error);
    return { success: false, error: 'Failed to create index in the database' };
  }
}