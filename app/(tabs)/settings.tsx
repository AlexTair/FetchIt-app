import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { 
  User, 
  Bell, 
  MapPin, 
  CreditCard, 
  Shield, 
  HelpCircle, 
  Star,
  ChevronRight,
  Crown,
  LucideIcon
} from "lucide-react-native";
import { useAppStore } from "@/stores/app-store";

type SettingItemBase = {
  icon: LucideIcon;
  title: string;
  subtitle: string;
};

type SettingItemButton = SettingItemBase & {
  onPress: () => void;
  highlight?: boolean;
};

type SettingItemToggle = SettingItemBase & {
  toggle: true;
  value: boolean;
  onToggle: React.Dispatch<React.SetStateAction<boolean>>;
};

type SettingItem = SettingItemButton | SettingItemToggle;

type SettingSection = {
  title: string;
  items: SettingItem[];
};

export default function SettingsScreen() {
  const { currentUser } = useAppStore();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [locationEnabled, setLocationEnabled] = React.useState(true);

  const settingSections: SettingSection[] = [
    {
      title: "Account",
      items: [
        {
          icon: User,
          title: "Profile",
          subtitle: "Edit your personal information",
          onPress: () => {},
        },
        {
          icon: Crown,
          title: "Upgrade to Premium",
          subtitle: "Unlock AI suggestions, receipt scanning & more",
          onPress: () => {},
          highlight: true,
        },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          icon: Bell,
          title: "Notifications",
          subtitle: "Push notifications and reminders",
          toggle: true,
          value: notificationsEnabled,
          onToggle: setNotificationsEnabled,
        },
        {
          icon: MapPin,
          title: "Location Services",
          subtitle: "Store reminders when nearby",
          toggle: true,
          value: locationEnabled,
          onToggle: setLocationEnabled,
        },
      ],
    },
    {
      title: "Billing",
      items: [
        {
          icon: CreditCard,
          title: "Payment Methods",
          subtitle: "Manage your payment options",
          onPress: () => {},
        },
        {
          icon: Star,
          title: "Subscription",
          subtitle: "Free plan • Upgrade available",
          onPress: () => {},
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: HelpCircle,
          title: "Help & Support",
          subtitle: "Get help with FetchIt!",
          onPress: () => {},
        },
        {
          icon: Shield,
          title: "Privacy Policy",
          subtitle: "How we protect your data",
          onPress: () => {},
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentUser && (
          <View style={styles.profileCard}>
            <View 
              style={[
                styles.profileAvatar,
                { backgroundColor: currentUser.color + "20" }
              ]}
            >
              <Text 
                style={[
                  styles.profileInitial,
                  { color: currentUser.color }
                ]}
              >
                {currentUser.name.charAt(0)}
              </Text>
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{currentUser.name}</Text>
              <Text style={styles.profileEmail}>{currentUser.email}</Text>
              <View style={styles.profileRole}>
                <Text style={styles.roleText}>
                  {currentUser.role === "admin" ? "Group Admin" : "Group Member"}
                </Text>
                {currentUser.role === "admin" && (
                  <Crown size={14} color="#FFD700" />
                )}
              </View>
            </View>
          </View>
        )}

        {settingSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            
            <View style={styles.sectionCard}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.settingItem,
                    itemIndex < section.items.length - 1 && styles.settingItemBorder,
                    'highlight' in item && item.highlight && styles.settingItemHighlight
                  ]}
                  onPress={'onPress' in item ? item.onPress : undefined}
                  disabled={'toggle' in item}
                >
                  <View style={styles.settingLeft}>
                    <View 
                      style={[
                        styles.settingIcon,
                        'highlight' in item && item.highlight && styles.settingIconHighlight
                      ]}
                    >
                      <item.icon 
                        size={20} 
                        color={'highlight' in item && item.highlight ? "#FFFFFF" : "#4CAF50"} 
                      />
                    </View>
                    
                    <View style={styles.settingInfo}>
                      <Text 
                        style={[
                          styles.settingTitle,
                          'highlight' in item && item.highlight && styles.settingTitleHighlight
                        ]}
                      >
                        {item.title}
                      </Text>
                      <Text 
                        style={[
                          styles.settingSubtitle,
                          'highlight' in item && item.highlight && styles.settingSubtitleHighlight
                        ]}
                      >
                        {item.subtitle}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.settingRight}>
                    {'toggle' in item ? (
                      <Switch
                        value={item.value}
                        onValueChange={item.onToggle}
                        trackColor={{ false: "#E0E0E0", true: "#4CAF50" }}
                        thumbColor="#FFFFFF"
                      />
                    ) : (
                      <ChevronRight 
                        size={20} 
                        color={'highlight' in item && item.highlight ? "#FFFFFF" : "#9E9E9E"} 
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>FetchIt! v1.0.0</Text>
          <Text style={styles.footerSubtext}>
            Made with ❤️ for better grocery shopping
          </Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  profileInitial: {
    fontSize: 24,
    fontWeight: "700",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#212121",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 6,
  },
  profileRole: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  roleText: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
  },
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212121",
    marginBottom: 12,
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  settingItemHighlight: {
    backgroundColor: "#4CAF50",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8F5E8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingIconHighlight: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#212121",
    marginBottom: 2,
  },
  settingTitleHighlight: {
    color: "#FFFFFF",
  },
  settingSubtitle: {
    fontSize: 14,
    color: "#757575",
  },
  settingSubtitleHighlight: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  settingRight: {
    marginLeft: 12,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 32,
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
    color: "#9E9E9E",
    fontWeight: "500",
  },
  footerSubtext: {
    fontSize: 12,
    color: "#BDBDBD",
    marginTop: 4,
  },
});
