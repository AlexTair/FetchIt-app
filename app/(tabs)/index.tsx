import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Plus, ShoppingCart, Users, DollarSign } from "lucide-react-native";
import { useAppStore } from "@/stores/app-store";
import { mockUsers, mockGroups, mockLists } from "@/data/mock-data";

export default function HomeScreen() {
  const { lists, currentUser, setCurrentUser, addGroup, addList } = useAppStore();

  useEffect(() => {
    // Initialize with mock data if no user exists
    if (!currentUser) {
      setCurrentUser(mockUsers[0]);
      
      // Add mock data if no lists exist
      if (lists.length === 0) {
        mockGroups.forEach(group => addGroup(group));
        mockLists.forEach(list => addList(list));
      }
    }
  }, [currentUser, lists.length]);

  const getItemCounts = (listId: string) => {
    const list = lists.find(l => l.id === listId);
    if (!list) return { total: 0, completed: 0 };
    
    const total = list.items.length;
    const completed = list.items.filter(item => item.status === "bought").length;
    return { total, completed };
  };

  const getStatusColor = (status: "needed" | "in-cart" | "bought") => {
    switch (status) {
      case "needed": return "#FF9800";
      case "in-cart": return "#2196F3";
      case "bought": return "#4CAF50";
      default: return "#9E9E9E";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.userName}>{currentUser?.name || "User"}</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push("/add-list")}>
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Lists</Text>
          
          {lists.map((list) => {
            const { total, completed } = getItemCounts(list.id);
            const progress = total > 0 ? completed / total : 0;
            
            return (
              <TouchableOpacity
                key={list.id}
                style={styles.listCard}
                onPress={() => router.push(`/list/${list.id}`)}
              >
                <View style={styles.listHeader}>
                  <View style={styles.listTitleRow}>
                    <Text style={styles.listEmoji}>{list.emoji}</Text>
                    <View style={styles.listInfo}>
                      <Text style={styles.listName}>{list.name}</Text>
                      {list.description && (
                        <Text style={styles.listDescription}>{list.description}</Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.listStats}>
                    <Text style={styles.itemCount}>{completed}/{total}</Text>
                  </View>
                </View>

                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${progress * 100}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {Math.round(progress * 100)}% complete
                  </Text>
                </View>

                <View style={styles.listFooter}>
                  <View style={styles.memberAvatars}>
                    <Users size={16} color="#9E9E9E" />
                    <Text style={styles.memberCount}>{list.members.length} members</Text>
                  </View>
                  
                  {list.budget && (
                    <View style={styles.budgetInfo}>
                      <DollarSign size={16} color="#9E9E9E" />
                      <Text style={styles.budgetText}>
                        ${list.totalSpent.toFixed(2)} / ${list.budget.toFixed(2)}
                      </Text>
                    </View>
                  )}
                </View>

                {list.items.length > 0 && (
                  <View style={styles.recentItems}>
                    {list.items.slice(0, 3).map((item) => (
                      <View key={item.id} style={styles.itemPreview}>
                        <View 
                          style={[
                            styles.itemStatus, 
                            { backgroundColor: getStatusColor(item.status) }
                          ]} 
                        />
                        <Text style={styles.itemName}>{item.name}</Text>
                      </View>
                    ))}
                    {list.items.length > 3 && (
                      <Text style={styles.moreItems}>+{list.items.length - 3} more</Text>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <ShoppingCart size={32} color="#4CAF50" />
              <Text style={styles.actionTitle}>Start Shopping</Text>
              <Text style={styles.actionSubtitle}>View items to buy</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push("/groups")}
            >
              <Users size={32} color="#2196F3" />
              <Text style={styles.actionTitle}>Manage Groups</Text>
              <Text style={styles.actionSubtitle}>Add or edit members</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  greeting: {
    fontSize: 16,
    color: "#9E9E9E",
    fontWeight: "400",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#212121",
    marginTop: 2,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#212121",
    marginBottom: 16,
  },
  listCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  listTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  listEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212121",
    marginBottom: 2,
  },
  listDescription: {
    fontSize: 14,
    color: "#757575",
  },
  listStats: {
    alignItems: "flex-end",
  },
  itemCount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4CAF50",
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#E8F5E8",
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: "#757575",
    fontWeight: "500",
  },
  listFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  memberAvatars: {
    flexDirection: "row",
    alignItems: "center",
  },
  memberCount: {
    fontSize: 12,
    color: "#9E9E9E",
    marginLeft: 4,
    fontWeight: "500",
  },
  budgetInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  budgetText: {
    fontSize: 12,
    color: "#9E9E9E",
    marginLeft: 4,
    fontWeight: "500",
  },
  recentItems: {
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
    paddingTop: 12,
  },
  itemPreview: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  itemStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  itemName: {
    fontSize: 14,
    color: "#616161",
    flex: 1,
  },
  moreItems: {
    fontSize: 12,
    color: "#9E9E9E",
    fontStyle: "italic",
    marginTop: 4,
  },
  quickActions: {
    marginTop: 32,
    marginBottom: 32,
  },
  actionGrid: {
    flexDirection: "row",
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212121",
    marginTop: 12,
    textAlign: "center",
  },
  actionSubtitle: {
    fontSize: 12,
    color: "#757575",
    marginTop: 4,
    textAlign: "center",
  },
});
