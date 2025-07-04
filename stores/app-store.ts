import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  id: string;
  name: string;
  email: string;
  color: string;
  role: "admin" | "member";
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity?: number;
  unit?: string;
  status: "needed" | "in-cart" | "bought";
  assignedTo?: string;
  addedBy: string;
  price?: number;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShoppingList {
  id: string;
  name: string;
  description?: string;
  emoji?: string;
  items: ShoppingItem[];
  members: string[];
  budget?: number;
  totalSpent: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Group {
  id: string;
  name: string;
  members: User[];
  lists: string[];
  createdBy: string;
  createdAt: Date;
}

interface AppState {
  currentUser: User | null;
  groups: Group[];
  lists: ShoppingList[];
  activeGroupId: string | null;
  
  // Actions
  setCurrentUser: (user: User) => void;
  addGroup: (group: Omit<Group, "id" | "createdAt">) => void;
  addList: (list: Omit<ShoppingList, "id" | "createdAt" | "updatedAt">) => void;
  updateList: (listId: string, updates: Partial<ShoppingList>) => void;
  addItem: (listId: string, item: Omit<ShoppingItem, "id" | "createdAt" | "updatedAt">) => void;
  updateItem: (listId: string, itemId: string, updates: Partial<ShoppingItem>) => void;
  deleteItem: (listId: string, itemId: string) => void;
  setActiveGroup: (groupId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      groups: [],
      lists: [],
      activeGroupId: null,

      setCurrentUser: (user) => set({ currentUser: user }),

      addGroup: (groupData) => {
        const newGroup: Group = {
          ...groupData,
          id: Date.now().toString(),
          createdAt: new Date(),
        };
        set((state) => ({ groups: [...state.groups, newGroup] }));
      },

      addList: (listData) => {
        const newList: ShoppingList = {
          ...listData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ lists: [...state.lists, newList] }));
      },

      updateList: (listId, updates) => {
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? { ...list, ...updates, updatedAt: new Date() }
              : list
          ),
        }));
      },

      addItem: (listId, itemData) => {
        const newItem: ShoppingItem = {
          ...itemData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? { ...list, items: [...list.items, newItem], updatedAt: new Date() }
              : list
          ),
        }));
      },

      updateItem: (listId, itemId, updates) => {
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  items: list.items.map((item) =>
                    item.id === itemId
                      ? { ...item, ...updates, updatedAt: new Date() }
                      : item
                  ),
                  updatedAt: new Date(),
                }
              : list
          ),
        }));
      },

      deleteItem: (listId, itemId) => {
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  items: list.items.filter((item) => item.id !== itemId),
                  updatedAt: new Date(),
                }
              : list
          ),
        }));
      },

      setActiveGroup: (groupId) => set({ activeGroupId: groupId }),
    }),
    {
      name: "fetchit-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        currentUser: state.currentUser,
        groups: state.groups,
        lists: state.lists,
        activeGroupId: state.activeGroupId,
      }),
    }
  )
);
