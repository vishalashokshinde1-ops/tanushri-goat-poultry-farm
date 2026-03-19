import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Order {
    contact: string;
    name: string;
    totalAmount: number;
    address: string;
    timestamp: bigint;
    items: Array<ItemsOrdered>;
}
export interface ItemsOrdered {
    productName: string;
    quantity: bigint;
    price: number;
}
export interface backendInterface {
    getAllOrders(): Promise<Array<Order>>;
    getOrder(orderId: bigint): Promise<Order>;
    getVisitorCount(): Promise<bigint>;
    incrementVisitorCount(): Promise<void>;
    placeOrder(name: string, address: string, contact: string, items: Array<ItemsOrdered>, totalAmount: number): Promise<void>;
}
