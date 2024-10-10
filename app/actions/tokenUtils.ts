export async function getTokenData(address: string) {
    try {
      const response = await fetch(`https://tokens.jup.ag/token/${address}`);
      if (!response.ok) throw new Error('Failed to fetch token data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching token data:', error);
      return null;
    }
  }
  
  export async function getTokenPrice(address: string) {
    try {
      const response = await fetch(`https://api.jup.ag/price/v2?ids=${address}`);
      if (!response.ok) throw new Error('Failed to fetch token price');
      const data = await response.json();
      return parseFloat(data.data[address].price);
    } catch (error) {
      console.error('Error fetching token price:', error);
      return null;
    }
  }