import React, { useCallback, useEffect, useState } from 'react';
import {StyleSheet, FlatList, TouchableOpacity, Text, ActivityIndicator} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {fetchPatchStatus, fetchCreateOrder, fetchPayOrder, fetchProducts} from "@/services/api";
import {Product} from "@/types/products";
import Toast from 'react-native-toast-message';
import {roundPrice} from "@/services/roundPrice";
import {loadStoredState} from "@/services/storageService";
import {useDispatch, useGlobalState} from "@/state/AppContext";

export default function PosScreen() {
  const dispatch = useDispatch()
  const state = useGlobalState()
  const [basket, setBasket] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [productsRefreshing, setProductsRefreshing] = useState(false);
  const [orderRefreshing, setOrderRefreshing] = useState(false);
  const [paymentRefreshing, setPaymentRefreshing] = useState(false);

  useEffect(() => {
    loadStoredState(dispatch)
  }, [])

  const getProducts = async () => {
    setProductsRefreshing(true);
    try{
      const productsFetched = await fetchProducts();
      if(productsFetched) {
        setProducts(productsFetched)
        dispatch({
          type: 'saveProducts',
          payload: { products: productsFetched },
        })
      }
    } catch(err) {
      setProductsRefreshing(false);
    }
    setProductsRefreshing(false);
  }

  useEffect(() => {
    if (state.stateLoaded && state.products) {
      setProducts(state.products)
    }
  }, [state.stateLoaded])

  useEffect(() => {
    getProducts();
  }, [])

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.product} onPress={() => setBasket((prev) => [...prev, item])}>
      <Text style={styles.text}>{item.name}</Text>
      <Text style={styles.text}>${roundPrice(item.price_unit * (item.vat_rate + 1))}</Text>
    </TouchableOpacity>
  )



  const createOrder = async () => {
    setOrderRefreshing(true);
    const totalOrder = { total: basket.reduce((acc, item) => acc + roundPrice(item.price_unit * (item.vat_rate + 1)), 0), }
    try {
      const order = await fetchCreateOrder(totalOrder);
      if(order) {
        setOrderId(order.id);
        Toast.show({
          type: 'success',
          text1: 'Order created',
          text2: 'Now you can proceed to payment'
        });
      }
      setOrderRefreshing(false);
    } catch(err) {
      setOrderRefreshing(false);
    }
  }

  const payOrder = useCallback( async() => {
    let tempBasket = basket;
    let tempOrderID = orderId;
    setBasket([]);
    setOrderId(null);
    setPaymentRefreshing(true);
    const payment = {
      order_id: orderId,
      amount: basket.reduce((acc, item) => acc + item.price_unit, 0)
    };
    try {
      const response = await fetchPayOrder(payment);
      if(response && response.status !== 'completed' && orderId) {
        const status = {status: 'completed'}
        await fetchPatchStatus(orderId, status);
      }
      Toast.show({
        type: 'success',
        text1: 'Order payed',
        text2: 'You can view it in the Orders screen'
      });
      setPaymentRefreshing(false)
    } catch (e) {
      setBasket(tempBasket);
      setOrderId(tempOrderID);
      setPaymentRefreshing(false);
    }
  }, [orderId, basket]);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.productGrid}>
        <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            numColumns={2}
            onRefresh={getProducts}
            refreshing={productsRefreshing}
        />
      </ThemedView>

      <ThemedView style={styles.basket}>
        <ThemedText type="title" style={styles.text}>Basket</ThemedText>

        {basket.map((item, index) => (
          <ThemedView key={index} style={styles.basketItem}>
            <Text style={styles.text}>{item.name}</Text>
            <Text style={styles.text}>${roundPrice(item.price_unit * (item.vat_rate + 1))}</Text>
          </ThemedView>
        ))}

        <ThemedText style={styles.text}>Total: ${roundPrice(basket.reduce((acc, item) => acc + item.price_unit * (item.vat_rate + 1), 0))}</ThemedText>

        <TouchableOpacity style={styles.button} onPress={createOrder} disabled={orderRefreshing}>
          <ThemedText style={styles.buttonText}>{orderRefreshing?<ActivityIndicator color="#ffffff"/>:"Create Order"}</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, !orderId && { backgroundColor: '#555' }]}
          onPress={payOrder}
          disabled={!orderId}
        >
          <ThemedText style={styles.buttonText}>{paymentRefreshing?<ActivityIndicator color="#ffffff"/>:"Pay"}</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  productGrid: {
    flex: 2,
    padding: 10,
  },
  product: {
    flex: 1,
    margin: 10,
    padding: 10,
    backgroundColor: '#1e1e1e',
    alignItems: 'center',
  },
  basket: {
    flex: 1,
    padding: 10,
    backgroundColor: '#1e1e1e',
  },
  basketItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    padding: 5,
  },
  text: {
    color: '#ffffff',
  },
  button: {
    backgroundColor: '#173829',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
