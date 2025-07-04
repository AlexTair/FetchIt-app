import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams, Stack } from "expo-router";
import { 
  ArrowLeft, 
  Plus, 
  Check, 
  ShoppingCart, 
  User,
  DollarSign,
  Search
} from "lucide-react-native";
import { useAppStore } from "@/stores/app-store";
import { mockUsers } from "@/data/mock-data";

export default function ListDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { lists, updateItem, addItem } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItemName, setNewItemName] = useState("");

  const list = lists.find(l => l.id === id);
  
  if (!list) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>List not found</Text>
      </SafeAreaView>
    );
  }

  const filteredItems = list.items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: "needed" | "in-cart" | "bought") => {
    switch (status) {
      case "needed": return "#FF9800";
      case "in-cart": return "#2196F3";
      case "bought": return "#4CAF50";
      default: return "#9E9E9E";
    }
  };

  const getStatusText = (status: "needed" | "in-cart" | "bought") => {
    switch (status) {
      case "needed": return "Need";
      case "in-cart": return "In Cart";
      case "bought": return "Bought";
      default: return "Unknown";
    }
  };

  const getUserById = (userId: string) => {
    return mockUsers.find(user => user.id === userId);
  };

  const toggleItemStatus = (itemId: string, currentStatus: "needed" | "in-cart" | "bought") => {
    let newStatus: "needed" | "in-cart" | "bought";
    
    switch (currentStatus) {
      case "needed":
        newStatus = "in-cart";
        break;
      case "in-cart":
        newStatus = "bought";
        break;
      case "bought":
        newStatus = "needed";
        break;
      default:
        newStatus = "needed";
    }
    
    updateItem(list.id, itemId, { status: newStatus });
  };

  const handleAddItem = () => {
    if (newItemName.trim()) {
      addItem(list.id, {
        name: newItemName.trim(),
        status: "needed",
        addedBy: "1", // Current user
      });
      setNewItemName("");
      setShowAddItem(false);
    }
  };

  const itemsByStatus = {
    needed: filteredItems.filter(item => item.status === "needed"),
    "in-cart": filteredItems.filter(item => item.status === "in-cart"),
    bought: filteredItems.filter(item => item.status === "bought"),
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#212121" />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.listEmoji}>{list.emoji}</Text>
          <View>
            <Text style={styles.listTitle}>{list.name}</Text>
            {list.description && (
              <Text style={styles.listSubtitle}>{list.description}</Text>
            )}
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddItem(true)}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {list.budget && (
        <View style={styles.budgetBar}>
          <View style={styles.budgetInfo}>
            <DollarSign size={16} color="#4CAF50" />
            <Text style={styles.budgetText}>
              ${list.totalSpent.toFixed(2)} / ${list.budget.toFixed(2)}
            </Text>
          </View>
          <View style={styles.budgetProgress}>
            <View 
              style={[
                styles.budgetFill, 
                { width: `${Math.min((list.totalSpent / list.budget) * 100, 100)}%` }
              ]} 
            />
          </View>
        </View>
      )}

      <View style={styles.searchContainer}>
        <Search size={20} color="#9E9E9E" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search items..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9E9E9E"
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {showAddItem && (
          <View style={styles.addItemContainer}>
            <TextInput
              style={styles.addItemInput}
              placeholder="Enter item name..."
              value={newItemName}
              onChangeText={setNewItemName}
              autoFocus
              onSubmitEditing={handleAddItem}
              placeholderTextColor="#9E9E9E"
            />
            <View style={styles.addItemActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => {
                  setShowAddItem(false);
                  setNewItemName("");
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleAddItem}
              >
                <Text style={styles.saveButtonText}>Add Item</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {Object.entries(itemsByStatus).map(([status, items]) => {
          if (items.length === 0) return null;
          
          return (
            <View key={status} style={styles.statusSection}>
              <View style={styles.statusHeader}>
                <View 
                  style={[
                    styles.statusIndicator, 
                    { backgroundColor: getStatusColor(status as any) }
                  ]} 
                />
                <Text style={styles.statusTitle}>
                  {getStatusText(status as any)} ({items.length})
                </Text>
              </View>
              
              {items.map((item) => {
                const assignedUser = item.assignedTo ? getUserById(item.assignedTo) : null;
                const addedByUser = getUserById(item.addedBy);
                
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.itemCard,
                      item.status === "bought" && styles.itemCardCompleted
                    ]}
                    onPress={() => toggleItemStatus(item.id, item.status)}
                  >
                    <View style={styles.itemLeft}>
                      <TouchableOpacity 
                        style={[
                          styles.checkbox,
                          { borderColor: getStatusColor(item.status) },
                          item.status === "bought" && { backgroundColor: getStatusColor(item.status) }
                        ]}
                        onPress={() => toggleItemStatus(item.id, item.status)}
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
                        
                        <View style={styles.itemMeta}>
                          {addedByUser && (
                            <Text style={styles.itemMetaText}>
                              Added by {addedByUser.name}
                            </Text>
                          )}
                          {assignedUser && (
                            <View style={styles.assignedTo}>
                              <User size={12} color="#9E9E9E" />
                              <Text style={styles.itemMetaText}>
                                {assignedUser.name}
                              </Text>
                            </View>
                          )}
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
                          {getStatusText(item.status)}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}
        
        {filteredItems.length === 0 && (
          <View style={styles.emptyState}>
            <ShoppingCart size={64} color="#E0E0E0" />
            <Text style={styles.emptyTitle}>No items found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? "Try a different search term" : "Add your first item to get started"}
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  listEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#212121",
  },
  listSubtitle: {
    fontSize: 14,
    color: "#757575",
    marginTop: 2,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  budgetBar: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  budgetInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  budgetText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4CAF50",
    marginLeft: 4,
  },
  budgetProgress: {
    height: 4,
    backgroundColor: "#E8F5E8",
    borderRadius: 2,
  },
  budgetFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#212121",
    marginLeft: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  addItemContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  addItemInput: {
    fontSize: 16,
    color: "#212121",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingVertical: 8,
    marginBottom: 16,
  },
  addItemActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    color: "#757575",
    fontWeight: "500",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  statusSection: {
    marginBottom: 24,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212121",
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
  itemMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  itemMetaText: {
    fontSize: 12,
    color: "#9E9E9E",
  },
  assignedTo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
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
