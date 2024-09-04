import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, Card, CardContent, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface PoolData {
  tokenA: string;
  tokenB: string;
  reserve0: number;
  reserve1: number;
  totalSupply: number;
  kLast: number;
}

interface OrderbookEntry {
  price: number;
  amount: number;
}

const App: React.FC = () => {
  const [poolData, setPoolData] = useState<PoolData | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [orderbook, setOrderbook] = useState<OrderbookEntry[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await backend.initialize();
        const backendPoolData = await backend.fetchPoolData();
        if ('ok' in backendPoolData) {
          setPoolData(backendPoolData.ok as PoolData);
        } else {
          console.error('Error fetching pool data:', backendPoolData.err);
        }

        const price = await backend.getCurrentPrice();
        setCurrentPrice(price[0] as number | null);

        const orderbookData = await backend.getOrderbook();
        setOrderbook(orderbookData as OrderbookEntry[]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h4" component="h1" gutterBottom>
        ICP/USDC Orderbook
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current ICP Price
              </Typography>
              <Typography variant="h4">
                ${currentPrice ? currentPrice.toFixed(4) : 'Loading...'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Liquidity Pool Info
              </Typography>
              {poolData ? (
                <>
                  <Typography>ICP Reserve: {poolData.reserve0.toFixed(2)}</Typography>
                  <Typography>USDC Reserve: {poolData.reserve1.toFixed(2)}</Typography>
                  <Typography>Total Supply: {poolData.totalSupply.toFixed(2)}</Typography>
                </>
              ) : (
                <Typography>Loading pool data...</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Orderbook
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Price</TableCell>
                      <TableCell>Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderbook.map((entry, index) => (
                      <TableRow key={index}>
                        <TableCell>{entry.price.toFixed(4)}</TableCell>
                        <TableCell>{entry.amount.toFixed(4)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
