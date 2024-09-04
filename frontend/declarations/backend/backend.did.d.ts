import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface OrderbookEntry { 'price' : number, 'amount' : number }
export interface PoolData {
  'reserve0' : number,
  'reserve1' : number,
  'totalSupply' : number,
  'tokenA' : string,
  'tokenB' : string,
  'kLast' : number,
}
export type Result = { 'ok' : PoolData } |
  { 'err' : string };
export interface _SERVICE {
  'fetchPoolData' : ActorMethod<[], Result>,
  'getCurrentPrice' : ActorMethod<[], [] | [number]>,
  'getOrderbook' : ActorMethod<[], Array<OrderbookEntry>>,
  'initialize' : ActorMethod<[], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
