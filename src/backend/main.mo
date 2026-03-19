import List "mo:core/List";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";

actor {
  // Data types
  type ItemsOrdered = {
    productName : Text;
    quantity : Nat;
    price : Float;
  };

  type Order = {
    name : Text;
    address : Text;
    contact : Text;
    items : [ItemsOrdered];
    totalAmount : Float;
    timestamp : Int;
  };

  // State variables
  var visitorCount = 0;
  let orders = Map.empty<Int, Order>();

  // Create and store order
  public shared ({ caller }) func placeOrder(name : Text, address : Text, contact : Text, items : [ItemsOrdered], totalAmount : Float) : async () {
    let timestamp = Time.now();
    let orderId = timestamp;
    let order : Order = {
      name;
      address;
      contact;
      items;
      totalAmount;
      timestamp;
    };
    orders.add(orderId, order);
  };

  // Increment and get visitor count
  public shared ({ caller }) func incrementVisitorCount() : async () {
    visitorCount += 1;
  };

  public query ({ caller }) func getVisitorCount() : async Nat {
    visitorCount;
  };

  // Get all orders
  public query ({ caller }) func getAllOrders() : async [Order] {
    orders.values().toArray();
  };

  // Get specific order by ID
  public query ({ caller }) func getOrder(orderId : Int) : async Order {
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) { order };
    };
  };
};
