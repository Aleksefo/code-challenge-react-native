import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {fetchOrders} from "@/services/api";
import {Order} from "@/types/orders";
import {useDispatch, useGlobalState} from "@/state/AppContext";


export default function TabTwoScreen() {
    const dispatch = useDispatch()
    const state = useGlobalState()
    const [orders, setOrders] = useState<Order[]>([]);
    const [ordersRefreshing, setOrdersRefreshing] = useState(false);

    useEffect(() => {
        if (state.stateLoaded && state.orders) {
            setOrders(state.orders)
        }
    }, [state.stateLoaded])

    useEffect(() => {
      getOrders();
  }, []);

  const getOrders = async () => {
      setOrdersRefreshing(true);
      try{
          const ordersFetched = await fetchOrders();
          if(ordersFetched) {
              let ordersReversed = ordersFetched.reverse()
              setOrders(ordersReversed);
              dispatch({
                  type: 'saveOrders',
                  payload: { orders: ordersReversed },
              })
          }
      } catch(err) {
          setOrdersRefreshing(false);
      }
      setOrdersRefreshing(false);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Paid Orders</ThemedText>
      </ThemedView>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        onRefresh={getOrders}
        refreshing={ordersRefreshing}
        renderItem={({ item }) => (
          <ThemedView style={styles.orderItem}>
            <ThemedText>{item.id}</ThemedText>
            <ThemedText>{item.created_at}</ThemedText>
            <ThemedText>{item.amount_total}$</ThemedText>
          </ThemedView>
        )}
      />

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
