import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, Card, CardContent, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';

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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        await backend.initialize();
        const backendPoolData = await backend.fetchPoolData();
        if ('ok' in backendPoolData) {
          setPoolData(backendPoolData.ok as PoolData);
        } else {
          throw new Error('Error fetching pool data: ' + backendPoolData.err);
        }

        const price = await backend.getCurrentPrice();
        setCurrentPrice(price[0] as number | null);

        const orderbookData = await backend.getOrderbook();
        console.log('Orderbook data:', orderbookData);
        setOrderbook(orderbookData as OrderbookEntry[]);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" className="py-8">
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" className="py-8">
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

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
                ${currentPrice ? currentPrice.toFixed(4) : 'N/A'}
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
                <Typography>No pool data available</Typography>
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
              {orderbook.length > 0 ? (
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
              ) : (
                <Typography>No orderbook data available</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
