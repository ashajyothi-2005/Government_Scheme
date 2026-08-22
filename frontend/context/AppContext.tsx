import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, GovernmentScheme, ChatMessage } from '../../shared/types';

export interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface AuthUser {
  name: string;
  email: string;
  provider: 'google' | 'email';
}

interface AppContextType {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  loadDemoProfile: () => void;
  resetProfile: () => void;
  savedSchemeIds: string[];
  toggleSaveScheme: (schemeId: string) => void;
  isAssistantOpen: boolean;
  setIsAssistantOpen: (open: boolean) => void;
  activeTab: 'explore' | 'recommendations' | 'saved' | 'how-it-works' | 'sources' | 'about' | 'admin';
  setActiveTab: (tab: 'explore' | 'recommendations' | 'saved' | 'how-it-works' | 'sources' | 'about' | 'admin') => void;
  selectedScheme: GovernmentScheme | null;
  setSelectedScheme: (scheme: GovernmentScheme | null) => void;
  isEligibilityModalOpen: boolean;
  setIsEligibilityModalOpen: (open: boolean) => void;
  isProfileWizardOpen: boolean;
  setIsProfileWizardOpen: (open: boolean) => void;
  isVoiceModalOpen: boolean;
  setIsVoiceModalOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedState: string;
  setSelectedState: (s: string) => void;
  notifications: { id: string; title: string; message: string; date: string; read: boolean }[];
  markNotificationsRead: () => void;
  authUser: AuthUser | null;
  signIn: (user: AuthUser) => void;
  signOut: () => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  startNewConversation: () => void;
  selectConversation: (id: string) => void;
  updateConversation: (messages: ChatMessage[]) => void;
  deleteConversation: (id: string) => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  state: 'All India',
  preferredLanguage: 'en',
  interestedCategories: [],
  savedSchemeIds: [],
};

const DEMO_PROFILE: UserProfile = {
  name: 'Ananya Sharma',
  age: 22,
  gender: 'female',
  state: 'Andhra Pradesh',
  district: 'Visakhapatnam',
  educationLevel: 'undergraduate',
  studentStatus: true,
  occupation: 'student',
  employmentType: 'unemployed',
  annualIncome: 200000,
  socialCategory: 'obc',
  disabilityStatus: false,
  ruralUrban: 'semi_urban',
  preferredLanguage: 'te',
  interestedCategories: ['education', 'women', 'employment'],
  savedSchemeIds: ['scheme-post-matric-scholarship', 'scheme-ap-jagananna-vidya-deevena'],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('schemesahay_auth_v2');
    return saved ? JSON.parse(saved) : null;
  });
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('schemesahay_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_PROFILE;
      }
    }
    return DEFAULT_PROFILE;
  });

  const [savedSchemeIds, setSavedSchemeIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('schemesahay_saved');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return ['scheme-post-matric-scholarship'];
      }
    }
    return ['scheme-post-matric-scholarship'];
  });

  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'explore' | 'recommendations' | 'saved' | 'how-it-works' | 'sources' | 'about' | 'admin'>('explore');
  const [selectedScheme, setSelectedScheme] = useState<GovernmentScheme | null>(null);
  const [isEligibilityModalOpen, setIsEligibilityModalOpen] = useState<boolean>(false);
  const [isProfileWizardOpen, setIsProfileWizardOpen] = useState<boolean>(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('All India');
  const initialConversation: Conversation = {
    id: 'conversation-welcome',
    title: 'Welcome to SchemeSahay',
    updatedAt: new Date().toISOString(),
    messages: [],
  };
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('schemesahay_conversations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [initialConversation];
      }
    }
    return [initialConversation];
  });
  const [activeConversationId, setActiveConversationId] = useState<string | null>(() =>
    localStorage.getItem('schemesahay_active_conversation') || 'conversation-welcome',
  );

  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Verified Guidelines Updated',
      message: 'Post-Matric Scholarship guidelines for academic year 2026-27 (v3.2) have been verified by the Central Committee.',
      date: '2026-08-22',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'PMAY Urban 2.0 Sanctions Open',
      message: 'New application window opened for interest subsidies under Credit-Linked Subsidy Scheme.',
      date: '2026-08-20',
      read: false,
    },
  ]);

  useEffect(() => {
    localStorage.setItem('schemesahay_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('schemesahay_saved', JSON.stringify(savedSchemeIds));
  }, [savedSchemeIds]);

  useEffect(() => {
    if (authUser) localStorage.setItem('schemesahay_auth_v2', JSON.stringify(authUser));
    else localStorage.removeItem('schemesahay_auth_v2');
  }, [authUser]);

  useEffect(() => {
    localStorage.setItem('schemesahay_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    if (activeConversationId) localStorage.setItem('schemesahay_active_conversation', activeConversationId);
  }, [activeConversationId]);

  const loadDemoProfile = () => {
    setUserProfile(DEMO_PROFILE);
    setSavedSchemeIds(DEMO_PROFILE.savedSchemeIds);
  };

  const resetProfile = () => {
    setUserProfile(DEFAULT_PROFILE);
  };

  const toggleSaveScheme = (schemeId: string) => {
    setSavedSchemeIds((prev) => {
      if (prev.includes(schemeId)) {
        return prev.filter((id) => id !== schemeId);
      } else {
        return [...prev, schemeId];
      }
    });
  };

  const markNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const signIn = (user: AuthUser) => setAuthUser(user);
  const signOut = () => {
    setAuthUser(null);
    setIsAssistantOpen(false);
  };

  const startNewConversation = () => {
    const conversation: Conversation = {
      id: `conversation-${Date.now()}`,
      title: 'New conversation',
      updatedAt: new Date().toISOString(),
      messages: [],
    };
    setConversations((prev) => [conversation, ...prev]);
    setActiveConversationId(conversation.id);
    setIsAssistantOpen(true);
  };

  const selectConversation = (id: string) => {
    setActiveConversationId(id);
    setIsAssistantOpen(true);
  };

  const deleteConversation = (id: string) => {
    setConversations((prev) => {
      const remaining = prev.filter((conversation) => conversation.id !== id);
      if (id === activeConversationId) {
        const nextConversation = remaining[0];
        if (nextConversation) setActiveConversationId(nextConversation.id);
        else {
          const freshConversation: Conversation = {
            id: `conversation-${Date.now()}`,
            title: 'New conversation',
            updatedAt: new Date().toISOString(),
            messages: [],
          };
          setActiveConversationId(freshConversation.id);
          return [freshConversation];
        }
      }
      return remaining;
    });
  };

  const updateConversation = (messages: ChatMessage[]) => {
    if (!activeConversationId) return;
    setConversations((prev) =>
      prev.map((conversation) => {
        if (conversation.id !== activeConversationId) return conversation;
        const firstUserMessage = messages.find((message) => message.role === 'user');
        return {
          ...conversation,
          messages,
          title: firstUserMessage?.content?.slice(0, 42) || conversation.title,
          updatedAt: new Date().toISOString(),
        };
      }),
    );
  };

  return (
    <AppContext.Provider
      value={{
        userProfile,
        setUserProfile,
        loadDemoProfile,
        resetProfile,
        savedSchemeIds,
        toggleSaveScheme,
        isAssistantOpen,
        setIsAssistantOpen,
        activeTab,
        setActiveTab,
        selectedScheme,
        setSelectedScheme,
        isEligibilityModalOpen,
        setIsEligibilityModalOpen,
        isProfileWizardOpen,
        setIsProfileWizardOpen,
        isVoiceModalOpen,
        setIsVoiceModalOpen,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedState,
        setSelectedState,
        notifications,
        markNotificationsRead,
        authUser,
        signIn,
        signOut,
        conversations,
        activeConversationId,
        startNewConversation,
        selectConversation,
        updateConversation,
        deleteConversation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
