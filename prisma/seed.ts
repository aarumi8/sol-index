import { prisma } from './prisma'
import { randomUUID } from 'crypto'

async function main() {
  // Create some sample indexes
  const index1 = await prisma.index.create({
    data: {
      address: randomUUID(),
      name: "DeFi Index",
      ticker: "DFI",
      price: 100.50,
    },
  })

  const index2 = await prisma.index.create({
    data: {
      address: randomUUID(),
      name: "NFT Index",
      ticker: "NFTI",
      price: 75.25,
    },
  })

  // Create some sample tokens
  const token1 = await prisma.token.create({
    data: {
      address: randomUUID(),
      name: "Ethereum",
      ticker: "ETH",
      imageURL: "https://example.com/eth.png",
      mcap: 200000000000,
      price: 2000,
    },
  })

  const token2 = await prisma.token.create({
    data: {
      address: randomUUID(),
      name: "Solana",
      ticker: "SOL",
      imageURL: "https://example.com/sol.png",
      mcap: 20000000000,
      price: 50,
    },
  })

  // Add tokens to indexes with percentages
  await prisma.tokenInIndex.createMany({
    data: [
      { indexId: index1.id, tokenId: token1.id, percentage: 60 },
      { indexId: index1.id, tokenId: token2.id, percentage: 40 },
      { indexId: index2.id, tokenId: token1.id, percentage: 30 },
      { indexId: index2.id, tokenId: token2.id, percentage: 70 },
    ],
  })

  // Create some sample index charts
  await prisma.indexChart.createMany({
    data: [
      { indexAddress: index1.address, price: 100.50, timestamp: new Date() },
      { indexAddress: index1.address, price: 101.00, timestamp: new Date(Date.now() - 86400000) }, // 1 day ago
      { indexAddress: index2.address, price: 75.25, timestamp: new Date() },
      { indexAddress: index2.address, price: 74.75, timestamp: new Date(Date.now() - 86400000) }, // 1 day ago
    ],
  })

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })