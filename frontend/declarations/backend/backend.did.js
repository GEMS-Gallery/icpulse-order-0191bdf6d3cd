export const idlFactory = ({ IDL }) => {
  const PoolData = IDL.Record({
    'reserve0' : IDL.Float64,
    'reserve1' : IDL.Float64,
    'totalSupply' : IDL.Float64,
    'tokenA' : IDL.Text,
    'tokenB' : IDL.Text,
    'kLast' : IDL.Float64,
  });
  const Result = IDL.Variant({ 'ok' : PoolData, 'err' : IDL.Text });
  const OrderbookEntry = IDL.Record({
    'price' : IDL.Float64,
    'amount' : IDL.Float64,
  });
  return IDL.Service({
    'fetchPoolData' : IDL.Func([], [Result], []),
    'getCurrentPrice' : IDL.Func([], [IDL.Opt(IDL.Float64)], ['query']),
    'getOrderbook' : IDL.Func([], [IDL.Vec(OrderbookEntry)], ['query']),
    'initialize' : IDL.Func([], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
