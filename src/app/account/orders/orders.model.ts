import { Address } from '../address.model';
export interface OrdersResponse {
  count: number;
  next: null;
  previous: null;
  results: Order[];
}

interface Order {
  code: string;
  created_at: string;
  delivery_date: string | null;
  gift_message: string;
  gift_tax: number;
  id: number;
  is_gift: boolean;
  is_refundable: boolean;
  order_address: Address;
  order_items_for_package: Object[];
  order_items_for_product: OrderItem[];
  order_status: string;
  payment_type: string;
  price: number;
  registered_order_id: number | null;
  transaction_id: number | null;
  user: string;
}
interface OrderItem {
  id: number;
  price: number;
  product_item: ProductItem;
  quantity: number;
  status: string;
}
interface ProductItem {
  discount_price: number;
  id: number;
  main_image: string;
  name: string;
  size: { height: number; length: number; width: number };
}
