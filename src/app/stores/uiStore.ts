import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UIState {
  // Global loading states
  isGlobalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
  
  // Modal states
  modals: Record<string, boolean>;
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  
  // Sidebar states
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  
  // Toast notifications
  toasts: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: number;
  }>;
  addToast: (toast: Omit<UIState['toasts'][0], 'id' | 'timestamp'>) => void;
  removeToast: (id: string) => void;
  
  // Search states
  globalSearchTerm: string;
  setGlobalSearchTerm: (term: string) => void;
}

// ✅ REQUIRED: Global UI state management with Zustand
export const useUIStore = create<UIState>()(
  devtools(
    (set, get) => ({
      // Global loading
      isGlobalLoading: false,
      setGlobalLoading: (loading) => set({ isGlobalLoading: loading }),
      
      // Modals
      modals: {},
      openModal: (modalId) =>
        set((state) => ({
          modals: { ...state.modals, [modalId]: true },
        })),
      closeModal: (modalId) =>
        set((state) => ({
          modals: { ...state.modals, [modalId]: false },
        })),
      
      // Sidebar
      isSidebarOpen: false,
      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
      
      // Toasts
      toasts: [],
      addToast: (toast) => {
        const id = Math.random().toString(36).substr(2, 9);
        const timestamp = Date.now();
        
        set((state) => ({
          toasts: [...state.toasts, { ...toast, id, timestamp }],
        }));
        
        // Auto remove after 5 seconds
        setTimeout(() => {
          get().removeToast(id);
        }, 5000);
      },
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        })),
      
      // Search
      globalSearchTerm: '',
      setGlobalSearchTerm: (term) => set({ globalSearchTerm: term }),
    }),
    {
      name: 'ui-store',
    }
  )
); 
