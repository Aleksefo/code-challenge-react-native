import {Product} from "@/types/products";
import { Order } from "@/types/orders";
import {fetchRequest} from "@/services/fetchRequest";

const fetchProducts = async () : Promise<Array<Product>> => {
    return await fetchRequest('https://kanpla-code-challenge.up.railway.app/products');
};

const fetchOrders = async () : Promise<Array<Order>> => {
    return await fetchRequest('https://kanpla-code-challenge.up.railway.app/orders');
};

const fetchCreateOrder = async (totalOrder: {total: number }) : Promise<Order> => {
    return await fetchRequest('https://kanpla-code-challenge.up.railway.app/orders', 'POST', totalOrder);
};

const fetchPayOrder = async (payment: { order_id: string | null; amount: number}) : Promise<Order> => {
    return await fetchRequest('https://kanpla-code-challenge.up.railway.app/payments', 'POST', payment);
}

const fetchPatchStatus = async (orderId: string, status: { status: string; }) => {
    return await fetchRequest(`https://kanpla-code-challenge.up.railway.app/orders/${orderId}`, 'PATCH', status);
}

export { fetchProducts, fetchOrders, fetchCreateOrder, fetchPayOrder, fetchPatchStatus };