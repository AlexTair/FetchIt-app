import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Users, Plus, Crown, User, Settings } from "lucide-react-native";
import { useAppStore } from "@/stores/app-store";
import { mockUsers } from "@/data/mock-data";

export default function GroupsScreen() {
  const { groups, currentUser } = useAppStore();

  const getUserById = (userId: string) => {
    return mockUsers.find(user => user.id === userId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Groups</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {groups.map((group) => (
          <View key={group.id} style={styles.groupCard}>
            <View style={styles.groupHeader}>
              <View style={styles.groupInfo}>
                <Text style={styles.groupName}>{group.name}</Text>
                <Text style={styles.memberCount}>
                  {group.members.length} members • {group.lists.length} lists
                </Text>
              </View>
              
              <TouchableOpacity style={styles.settingsButton}>
                <Settings size={20} color="#9E9E9E" />
              </TouchableOpacity>
            </View>

            <View style={styles.membersSection}>
              <Text style={styles.sectionTitle}>Members</Text>
              
              {group.members.map((member) => (
                <View key={member.id} style={styles.memberRow}>
                  <View style={styles.memberLeft}>
                    <View 
                      style={[
                        styles.memberAvatar,
                        { backgroundColor: member.color + "20" }
                      ]}
                    >
                      <Text 
                        style={[
                          styles.memberInitial,
                          { color: member.color }
                        ]}
                      >
                        {member.name.charAt(0)}
                      </Text>
                    </View>
                    
                    <View style={styles.memberInfo}>
                      <View style={styles.memberNameRow}>
                        <Text style={styles.memberName}>{member.name}</Text>
                        {member.role === "admin" && (
                          <Crown size={14} color="#FFD700" />
                        )}
                        {member.id === currentUser?.id && (
                          <Text style={styles.youLabel}>(You)</Text>
                        )}
                      </View>
                      <Text style={styles.memberEmail}>{member.email}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.memberRight}>
                    <View 
                      style={[
                        styles.roleBadge,
                        member.role === "admin" 
                          ? styles.adminBadge 
                          : styles.memberBadge
                      ]}
                    >
                      <Text 
                        style={[
                          styles.roleText,
                          member.role === "admin" 
                            ? styles.adminText 
                            : styles.memberText
                        ]}
                      >
                        {member.role === "admin" ? "Admin" : "Member"}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.groupActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Users size={16} color="#4CAF50" />
                <Text style={styles.actionButtonText}>Invite Members</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Plus size={16} color="#4CAF50" />
                <Text style={styles.actionButtonText}>Create List</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.createGroupCard}>
          <View style={styles.createGroupIcon}>
            <Plus size={24} color="#4CAF50" />
          </View>
          <Text style={styles.createGroupTitle}>Create New Group</Text>
          <Text style={styles.createGroupSubtitle}>
            Start a new household or team
          </Text>
        </TouchableOpacity>

        <View style={styles.inviteSection}>
          <Text style={styles.sectionTitle}>Join a Group</Text>
          <Text style={styles.sectionDescription}>
            Have an invite code? Enter it below to join an existing group.
          </Text>
          
          <TouchableOpacity style={styles.joinButton}>
            <Text style={styles.joinButtonText}>Enter Invite Code</Text>
          </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#212121",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  groupCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  groupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#212121",
    marginBottom: 4,
  },
  memberCount: {
    fontSize: 14,
    color: "#757575",
  },
  settingsButton: {
    padding: 4,
  },
  membersSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212121",
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 16,
    lineHeight: 20,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  memberLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  memberInitial: {
    fontSize: 16,
    fontWeight: "600",
  },
  memberInfo: {
    flex: 1,
  },
  memberNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#212121",
  },
  youLabel: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
  },
  memberEmail: {
    fontSize: 14,
    color: "#757575",
    marginTop: 2,
  },
  memberRight: {
    alignItems: "flex-end",
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  adminBadge: {
    backgroundColor: "#FFF3E0",
  },
  memberBadge: {
    backgroundColor: "#E3F2FD",
  },
  roleText: {
    fontSize: 12,
    fontWeight: "500",
  },
  adminText: {
    color: "#FF9800",
  },
  memberText: {
    color: "#2196F3",
  },
  groupActions: {
    flexDirection: "row",
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
    paddingTop: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F8FFF8",
    borderRadius: 12,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4CAF50",
  },
  createGroupCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 32,
    marginTop: 20,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: "#F0F0F0",
    borderStyle: "dashed",
  },
  createGroupIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E8F5E8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  createGroupTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212121",
    marginBottom: 4,
  },
  createGroupSubtitle: {
    fontSize: 14,
    color: "#757575",
    textAlign: "center",
  },
  inviteSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 32,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  joinButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  joinButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
