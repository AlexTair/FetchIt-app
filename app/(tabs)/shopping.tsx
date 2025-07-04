import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ShoppingCart, Check, MapPin, Clock } from "lucide-react-native";
import { useAppStore } from "@/stores/app-store";

export default function ShoppingScreen() {
  const { lists, updateItem } = useAppStore();
  const [selectedStore, setSelectedStore] = useState<string | null>(null);

  // Get all items that need to be bought or are in cart
  const shoppingItems = lists.flatMap(list => 
    list.items
      .filter(item => item.status === "needed" || item.status === "in-cart")
      .map(item => ({ ...item, listId: list.id, listName: list.name, listEmoji: list.emoji }))
  );

  const itemsByStore = {
    "Whole Foods": shoppingItems.filter(item => 
      ["Organic Milk", "Greek Yogurt", "Sourdough Bread"].includes(item.name)
    ),
    "Target": shoppingItems.filter(item => 
      ["Balloons", "Marshmallows"].includes(item.name)
    ),
    "Safeway": shoppingItems.filter(item => 
      !["Organic Milk", "Greek Yogurt", "Sourdough Bread", "Balloons", "Marshmallows"].includes(item.name)
    ),
  };

  const getStatusColor = (status: "needed" | "in-cart" | "bought") => {
    switch (status) {
      case "needed": return "#FF9800";
      case "in-cart": return "#2196F3";
      case "bought": return "#4CAF50";
      default: return "#9E9E9E";
    }
  };

  const toggleItemStatus = (listId: string, itemId: string, currentStatus: "needed" | "in-cart" | "bought") => {
    const newStatus = currentStatus === "needed" ? "in-cart" : 
                     currentStatus === "in-cart" ? "bought" : "needed";
    updateItem(listId, itemId, { status: newStatus });
  };

  const stores = [
    { name: "Whole Foods", distance: "0.3 mi", eta: "5 min" },
    { name: "Target", distance: "0.8 mi", eta: "12 min" },
    { name: "Safeway", distance: "1.2 mi", eta: "18 min" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shopping Mode</Text>
        <Text style={styles.subtitle}>
          {shoppingItems.length} items to collect
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.storeSelector}>
          <Text style={styles.sectionTitle}>Nearby Stores</Text>
          
          {stores.map((store) => {
            const storeItems = itemsByStore[store.name as keyof typeof itemsByStore] || [];
            const isSelected = selectedStore === store.name;
            
            return (
              <TouchableOpacity
                key={store.name}
                style={[
                  styles.storeCard,
                  isSelected && styles.storeCardSelected
                ]}
                onPress={() => setSelectedStore(isSelected ? null : store.name)}
              >
                <View style={styles.storeInfo}>
                  <Text style={[
                    styles.storeName,
                    isSelected && styles.storeNameSelected
                  ]}>
                    {store.name}
                  </Text>
                  
                  <View style={styles.storeDetails}>
                    <View style={styles.storeDetail}>
                      <MapPin size={14} color="#9E9E9E" />
                      <Text style={styles.storeDetailText}>{store.distance}</Text>
                    </View>
                    <View style={styles.storeDetail}>
                      <Clock size={14} color="#9E9E9E" />
                      <Text style={styles.storeDetailText}>{store.eta}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.storeStats}>
                  <Text style={styles.itemCount}>{storeItems.length}</Text>
                  <Text style={styles.itemCountLabel}>items</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedStore ? (
          <View style={styles.storeItems}>
            <Text style={styles.sectionTitle}>Items at {selectedStore}</Text>
            
            {(itemsByStore[selectedStore as keyof typeof itemsByStore] || []).map((item) => (
              <TouchableOpacity
                key={`${item.listId}-${item.id}`}
                style={[
                  styles.itemCard,
                  item.status === "bought" && styles.itemCardCompleted
                ]}
                onPress={() => toggleItemStatus(item.listId, item.id, item.status)}
              >
                <View style={styles.itemLeft}>
                  <TouchableOpacity 
                    style={[
                      styles.checkbox,
                      { borderColor: getStatusColor(item.status) },
                      item.status === "bought" && { backgroundColor: getStatusColor(item.status) },
                      item.status === "in-cart" && { backgroundColor: getStatusColor(item.status) + "20" }
                    ]}
                    onPress={() => toggleItemStatus(item.listId, item.id, item.status)}
                  >
                    {item.status === "bought" && (
                      <Check size={16} color="#FFFFFF" />
                    )}
                    {item.status === "in-cart" && (
                      <ShoppingCart size={16} color={getStatusColor(item.status)} />
                    )}
                  </TouchableOpacity>
                  
                  <View style={styles.itemInfo}>
                    <Text 
                      style={[
                        styles.itemName,
                        item.status === "bought" && styles.itemNameCompleted
                      ]}
                    >
                      {item.name}
                    </Text>
                    
                    {(item.quantity || item.unit) && (
                      <Text style={styles.itemQuantity}>
                        {item.quantity} {item.unit}
                      </Text>
                    )}
                    
                    <View style={styles.itemSource}>
                      <Text style={styles.listEmoji}>{item.listEmoji}</Text>
                      <Text style={styles.listName}>{item.listName}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.itemRight}>
                  {item.price && (
                    <Text style={styles.itemPrice}>
                      ${item.price.toFixed(2)}
                    </Text>
                  )}
                  
                  <View 
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(item.status) + "20" }
                    ]}
                  >
                    <Text 
                      style={[
                        styles.statusBadgeText,
                        { color: getStatusColor(item.status) }
                      ]}
                    >
                      {item.status === "needed" ? "Need" : 
                       item.status === "in-cart" ? "In Cart" : "Bought"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.allItems}>
            <Text style={styles.sectionTitle}>All Shopping Items</Text>
            
            {shoppingItems.map((item) => (
              <TouchableOpacity
                key={`${item.listId}-${item.id}`}
                style={[
                  styles.itemCard,
                  item.status === "bought" && styles.itemCardCompleted
                ]}
                onPress={() => router.push(`/list/${item.listId}`)}
              >
                <View style={styles.itemLeft}>
                  <View 
                    style={[
                      styles.statusIndicator,
                      { backgroundColor: getStatusColor(item.status) }
                    ]} 
                  />
                  
                  <View style={styles.itemInfo}>
                    <Text 
                      style={[
                        styles.itemName,
                        item.status === "bought" && styles.itemNameCompleted
                      ]}
                    >
                      {item.name}
                    </Text>
                    
                    {(item.quantity || item.unit) && (
                      <Text style={styles.itemQuantity}>
                        {item.quantity} {item.unit}
                      </Text>
                    )}
                    
                    <View style={styles.itemSource}>
                      <Text style={styles.listEmoji}>{item.listEmoji}</Text>
                      <Text style={styles.listName}>{item.listName}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.itemRight}>
                  {item.price && (
                    <Text style={styles.itemPrice}>
                      ${item.price.toFixed(2)}
                    </Text>
                  )}
                  
                  <View 
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(item.status) + "20" }
                    ]}
                  >
                    <Text 
                      style={[
                        styles.statusBadgeText,
                        { color: getStatusColor(item.status) }
                      ]}
                    >
                      {item.status === "needed" ? "Need" : 
                       item.status === "in-cart" ? "In Cart" : "Bought"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {shoppingItems.length === 0 && (
          <View style={styles.emptyState}>
            <ShoppingCart size={64} color="#E0E0E0" />
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptySubtitle}>
              No items to shop for right now
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#212121",
  },
  subtitle: {
    fontSize: 14,
    color: "#757575",
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212121",
    marginBottom: 16,
    marginTop: 24,
  },
  storeSelector: {
    marginBottom: 8,
  },
  storeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 2,
    borderColor: "transparent",
  },
  storeCardSelected: {
    borderColor: "#4CAF50",
    backgroundColor: "#F8FFF8",
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212121",
    marginBottom: 4,
  },
  storeNameSelected: {
    color: "#4CAF50",
  },
  storeDetails: {
    flexDirection: "row",
    gap: 16,
  },
  storeDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  storeDetailText: {
    fontSize: 12,
    color: "#9E9E9E",
  },
  storeStats: {
    alignItems: "center",
  },
  itemCount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4CAF50",
  },
  itemCountLabel: {
    fontSize: 12,
    color: "#9E9E9E",
  },
  storeItems: {
    marginBottom: 32,
  },
  allItems: {
    marginBottom: 32,
  },
  itemCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemCardCompleted: {
    opacity: 0.7,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#212121",
    marginBottom: 2,
  },
  itemNameCompleted: {
    textDecorationLine: "line-through",
    color: "#9E9E9E",
  },
  itemQuantity: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 4,
  },
  itemSource: {
    flexDirection: "row",
    alignItems: "center",
  },
  listEmoji: {
    fontSize: 12,
    marginRight: 4,
  },
  listName: {
    fontSize: 12,
    color: "#9E9E9E",
  },
  itemRight: {
    alignItems: "flex-end",
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4CAF50",
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#9E9E9E",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#BDBDBD",
    textAlign: "center",
  },
});
