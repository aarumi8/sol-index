import Token from "./token";
import ChartData from "./chartData";

export default interface IndexData {
    id: string;
    address: string;
    name: string;
    ticker: string;
    price: number;
    tokens: Token[];
    chartData: ChartData[];
  }