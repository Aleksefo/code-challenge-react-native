import React, { useEffect, useState } from 'react';
import { FlatList, ActivityIndicator, View } from 'react-native';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {fetchOrders} from "@/services/api";
import {Order} from "@/types/orders";


export default function TabTwoScreen() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
      getOrders();
  }, []);

  const getOrders = async () => {
        const ordersFetched = await fetchOrders();
        if(ordersFetched) {
            setOrders(ordersFetched);
        }
  };


  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Paid Orders</ThemedText>
      </ThemedView>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ThemedView style={styles.orderItem}>
            <ThemedText>{item.id}</ThemedText>
            <ThemedText>{item.created_at}</ThemedText>
            <ThemedText>{item.amount}$</ThemedText>
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
