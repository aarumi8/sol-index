import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Address parameter is required' }, { status: 400 });
  }

  try {
    const index = await prisma.index.findUnique({
      where: { address },
      include: {
        tokens: {
          include: {
            token: true,
          },
          orderBy: {
            percentage: 'desc',
          },
        },
        charts: {
          orderBy: {
            timestamp: 'asc',
          },
          take: 100, // Adjust this number based on how many data points you want for the chart
        },
      },
    });

    if (!index) {
      return NextResponse.json({ error: 'Index not found' }, { status: 404 });
    }

    const formattedIndex = {
      id: index.id,
      address: index.address,
      name: index.name,
      ticker: index.ticker,
      price: index.price,
      tokens: index.tokens.map(tokenInIndex => ({
        token: tokenInIndex.token.ticker,
        price: tokenInIndex.token.price,
        mcap: `$${(tokenInIndex.token.mcap / 1e9).toFixed(1)}B`, // Assuming mcap is stored in dollars
        percentage: tokenInIndex.percentage,
      })),
      chartData: index.charts.map(chart => ({
        date: chart.timestamp.toISOString(),
        price: chart.price,
      })),
    };

    return NextResponse.json(formattedIndex);
  } catch (error) {
    console.error('Failed to fetch index:', error);
    return NextResponse.json(
      { error: 'Failed to fetch index' },
      { status: 500 }
    );
  }
}