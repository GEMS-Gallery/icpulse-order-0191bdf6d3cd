import Hash "mo:base/Hash";
import Order "mo:base/Order";

import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Error "mo:base/Error";
import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Option "mo:base/Option";
import Result "mo:base/Result";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";

actor {
  type PoolData = {
    tokenA: Text;
    tokenB: Text;
    reserve0: Float;
    reserve1: Float;
    totalSupply: Float;
    kLast: Float;
  };

  type OrderbookEntry = {
    price: Float;
    amount: Float;
  };

  stable var poolData: ?PoolData = null;
  var orderbook: [OrderbookEntry] = [
    { price = 8.5; amount = 100.0 },
    { price = 8.6; amount = 200.0 },
    { price = 8.7; amount = 150.0 },
    { price = 8.8; amount = 300.0 },
    { price = 8.9; amount = 250.0 }
  ];

  public func fetchPoolData(): async Result.Result<PoolData, Text> {
    let mockPoolData : PoolData = {
      tokenA = "ICP";
      tokenB = "USDC";
      reserve0 = 1000000.0;
      reserve1 = 8000000.0;
      totalSupply = 2000000.0;
      kLast = 8000000000000.0;
    };
    poolData := ?mockPoolData;
    #ok(mockPoolData)
  };

  public query func getOrderbook(): async [OrderbookEntry] {
    orderbook
  };

  public query func getCurrentPrice(): async ?Float {
    switch (poolData) {
      case (null) { null };
      case (?data) {
        ?Float.div(data.reserve1, data.reserve0)
      };
    }
  };

  public func initialize() : async () {
    ignore fetchPoolData();
  };
}
