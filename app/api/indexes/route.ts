import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';

export async function GET() {
  try {
    const indexes = await prisma.index.findMany({
      include: {
        tokens: {
          include: {
            token: true,
          },
          orderBy: {
            percentage: 'desc',
          },
          take: 3,
        },
      },
    });

    const formattedIndexes = indexes.map(index => ({
      id: index.id,
      address: index.address,
      name: index.name,
      ticker: index.ticker,
      price: index.price,
      topTokens: index.tokens.map(tokenInIndex => ({
        id: tokenInIndex.token.id,
        address: tokenInIndex.token.address,
        name: tokenInIndex.token.name,
        ticker: tokenInIndex.token.ticker,
        imageURL: tokenInIndex.token.imageURL,
        percentage: tokenInIndex.percentage,
      })),
    }));

    return NextResponse.json(formattedIndexes);
  } catch (error) {
    console.error('Failed to fetch indexes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch indexes' },
      { status: 500 }
    );
  }
}