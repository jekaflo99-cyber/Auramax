import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Habit, Post, User, AuraLog, ViewTab, UserInventory } from '../types';
import { INITIAL_HABITS, INITIAL_LOGS, INITIAL_POSTS, INITIAL_USERS } from '../lib/mockData';
import { soundEffects, triggerConfettiBurst } from '../lib/auraEngine';
import { SHOP_ITEMS } from '../lib/shopData';

interface FloatingAuraFeedback {
  id: string;
  amount: number;
  type: '+aura' | '-aura';
  x: number;
  y: number;
}

interface AuraContextType {
  currentUser: User;
  allUsers: User[];
  posts: Post[];
  habits: Habit[];
  auraLogs: AuraLog[];
  inventory: UserInventory;
  currentTab: ViewTab;
  soundEnabled: boolean;
  floatingFeedbacks: FloatingAuraFeedback[];
  setCurrentTab: (tab: ViewTab) => void;
  setSoundEnabled: (enabled: boolean | ((prev: boolean) => boolean)) => void;
  voteOnPost: (postId: string, voteType: '+aura' | '-aura', clientCoords?: { x: number; y: number }) => void;
  toggleHabit: (habitId: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'userId' | 'completedDates' | 'streak'>) => void;
  createPost: (postData: { caption: string; mediaUrl: string; mediaType: 'image' | 'video'; tags: string[]; videoDuration?: number }) => void;
  buyShopItem: (itemId: string) => { success: boolean; message: string };
  buyCoinPack: (itemId: string) => void;
  equipItem: (itemId: string, category: 'thematic_frame' | 'halo_skin' | 'badge_title' | 'video_effect') => void;
  unequipItem: (category: 'thematic_frame' | 'halo_skin' | 'badge_title' | 'video_effect') => void;
  useStreakFreeze: () => boolean;
  switchUser: (userId: string) => void;
  updateCurrentUserProfile: (profile: Partial<User>) => void;
  resetAllData: () => void;
}

const AuraContext = createContext<AuraContextType | undefined>(undefined);

const STORAGE_KEY = 'auramax_v1_data';

const INITIAL_INVENTORY: UserInventory = {
  coins: 850, // Starter bonus coins
  streakFreezes: 2, // 2 Freezes by default
  ownedItemIds: ['frame_hellfire', 'title_5am_grinder'],
  equippedHaloSkinId: 'frame_hellfire',
  equippedBadgeTitle: '5AM CLUB GRINDER',
  equippedVideoEffectId: undefined
};

export const AuraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<ViewTab>('feed');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [floatingFeedbacks, setFloatingFeedbacks] = useState<FloatingAuraFeedback[]>([]);

  // Load from LocalStorage or initialize
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_current_uid`);
    return saved || 'user_alex';
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_posts`);
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_habits`);
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });

  const [auraLogs, setAuraLogs] = useState<AuraLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_logs`);
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  const [inventory, setInventory] = useState<UserInventory>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_inventory`);
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  // Current active user object
  const currentUser = useMemo(() => {
    const found = allUsers.find(u => u.id === currentUserId);
    return found || allUsers[0] || INITIAL_USERS[0];
  }, [allUsers, currentUserId]);

  // Persist state
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(allUsers));
    localStorage.setItem(`${STORAGE_KEY}_current_uid`, currentUserId);
    localStorage.setItem(`${STORAGE_KEY}_posts`, JSON.stringify(posts));
    localStorage.setItem(`${STORAGE_KEY}_habits`, JSON.stringify(habits));
    localStorage.setItem(`${STORAGE_KEY}_logs`, JSON.stringify(auraLogs));
    localStorage.setItem(`${STORAGE_KEY}_inventory`, JSON.stringify(inventory));
  }, [allUsers, currentUserId, posts, habits, auraLogs, inventory]);

  // Helper to add floating visual animation
  const addFloatingFeedback = (amount: number, type: '+aura' | '-aura', coords?: { x: number; y: number }) => {
    const id = Math.random().toString(36).substring(2, 9);
    const feedback: FloatingAuraFeedback = {
      id,
      amount,
      type,
      x: coords?.x ?? (window.innerWidth / 2),
      y: coords?.y ?? (window.innerHeight / 2)
    };
    setFloatingFeedbacks(prev => [...prev, feedback]);
    setTimeout(() => {
      setFloatingFeedbacks(prev => prev.filter(f => f.id !== id));
    }, 1500);
  };

  // Vote on a Social Post (+Aura / -Aura)
  const voteOnPost = (postId: string, voteType: '+aura' | '-aura', clientCoords?: { x: number; y: number }) => {
    const targetPost = posts.find(p => p.id === postId);
    if (!targetPost) return;

    const previousVote = targetPost.userVote;
    let deltaAura = 0;
    let plusDiff = 0;
    let minusDiff = 0;
    let newVote: '+aura' | '-aura' | null = voteType;

    const AURA_PLUS_VALUE = 100;
    const AURA_MINUS_VALUE = 50;

    if (previousVote === voteType) {
      // Toggle off / Cancel vote
      newVote = null;
      if (voteType === '+aura') {
        plusDiff = -1;
        deltaAura = -AURA_PLUS_VALUE;
      } else {
        minusDiff = -1;
        deltaAura = AURA_MINUS_VALUE;
      }
    } else if (previousVote === null || previousVote === undefined) {
      // New vote
      if (voteType === '+aura') {
        plusDiff = 1;
        deltaAura = AURA_PLUS_VALUE;
      } else {
        minusDiff = 1;
        deltaAura = -AURA_MINUS_VALUE;
      }
    } else {
      // Flipping vote from + to - or - to +
      if (voteType === '+aura') {
        plusDiff = 1;
        minusDiff = -1;
        deltaAura = AURA_PLUS_VALUE + AURA_MINUS_VALUE;
      } else {
        plusDiff = -1;
        minusDiff = 1;
        deltaAura = -(AURA_PLUS_VALUE + AURA_MINUS_VALUE);
      }
    }

    // Play Sound & visual feedback
    if (soundEnabled) {
      if (voteType === '+aura') soundEffects.playAuraGain();
      else soundEffects.playAuraLoss();
    }

    addFloatingFeedback(Math.abs(deltaAura), voteType, clientCoords);

    // Update Post
    setPosts(prevPosts =>
      prevPosts.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            auraGain: Math.max(0, p.auraGain + deltaAura),
            plusVotes: Math.max(0, p.plusVotes + plusDiff),
            minusVotes: Math.max(0, p.minusVotes + minusDiff),
            userVote: newVote
          };
        }
        return p;
      })
    );

    // Update author's aura
    setAllUsers(prevUsers =>
      prevUsers.map(u => {
        if (u.id === targetPost.userId) {
          const newAura = Math.max(0, u.aura + deltaAura);
          let newTier = u.tier;
          if (newAura >= 10000) newTier = 'cosmic';
          else if (newAura >= 5000) newTier = 'god';
          else if (newAura >= 1000) newTier = 'rising';
          else newTier = 'npc';

          return {
            ...u,
            aura: newAura,
            tier: newTier,
            socialAuraEarned: Math.max(0, u.socialAuraEarned + deltaAura)
          };
        }
        return u;
      })
    );

    // Log Aura transaction
    const newLog: AuraLog = {
      id: `log_${Date.now()}`,
      userId: targetPost.userId,
      amount: deltaAura,
      source: 'post_vote_received',
      description: `Recebeste ${deltaAura >= 0 ? '+' : ''}${deltaAura} Aura da comunidade no teu post.`,
      timestamp: new Date().toISOString()
    };
    setAuraLogs(prev => [newLog, ...prev]);
  };

  // Toggle Habit completion for today
  const toggleHabit = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const targetHabit = habits.find(h => h.id === habitId);
    if (!targetHabit) return;

    const isCompletedToday = targetHabit.completedDates.includes(today);
    const auraDelta = isCompletedToday ? -targetHabit.auraReward : targetHabit.auraReward;

    if (soundEnabled && !isCompletedToday) {
      soundEffects.playHabitComplete();
      triggerConfettiBurst(currentUser.tier);
    }

    addFloatingFeedback(targetHabit.auraReward, isCompletedToday ? '-aura' : '+aura');

    setHabits(prevHabits =>
      prevHabits.map(h => {
        if (h.id === habitId) {
          const updatedDates = isCompletedToday
            ? h.completedDates.filter(d => d !== today)
            : [...h.completedDates, today];
          const newStreak = isCompletedToday ? Math.max(0, h.streak - 1) : h.streak + 1;
          return {
            ...h,
            completedDates: updatedDates,
            streak: newStreak
          };
        }
        return h;
      })
    );

    // Update currentUser aura & streak
    setAllUsers(prevUsers =>
      prevUsers.map(u => {
        if (u.id === currentUser.id) {
          const newAura = Math.max(0, u.aura + auraDelta);
          let newTier = u.tier;
          if (newAura >= 10000) newTier = 'cosmic';
          else if (newAura >= 5000) newTier = 'god';
          else if (newAura >= 1000) newTier = 'rising';
          else newTier = 'npc';

          return {
            ...u,
            aura: newAura,
            tier: newTier,
            disciplineAuraEarned: Math.max(0, u.disciplineAuraEarned + auraDelta),
            dailyAuraEarned: Math.max(0, u.dailyAuraEarned + auraDelta),
            streak: isCompletedToday ? Math.max(0, u.streak - 1) : u.streak + 1
          };
        }
        return u;
      })
    );

    // Add transaction log
    const newLog: AuraLog = {
      id: `log_${Date.now()}`,
      userId: currentUser.id,
      amount: auraDelta,
      source: 'habit',
      description: isCompletedToday
        ? `Desmarcado: ${targetHabit.title} (-${targetHabit.auraReward} Aura)`
        : `Completado: ${targetHabit.title} (+${targetHabit.auraReward} Aura)`,
      timestamp: new Date().toISOString()
    };
    setAuraLogs(prev => [newLog, ...prev]);
  };

  // Add new custom Habit
  const addHabit = (habitData: Omit<Habit, 'id' | 'userId' | 'completedDates' | 'streak'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: `habit_${Date.now()}`,
      userId: currentUser.id,
      completedDates: [],
      streak: 0
    };
    setHabits(prev => [newHabit, ...prev]);
  };

  // Create new Post in Aura Social
  const createPost = (postData: { caption: string; mediaUrl: string; mediaType: 'image' | 'video'; tags: string[]; videoDuration?: number }) => {
    const newPost: Post = {
      id: `post_${Date.now()}`,
      userId: currentUser.id,
      author: {
        id: currentUser.id,
        username: currentUser.username,
        displayName: currentUser.displayName,
        avatarUrl: currentUser.avatarUrl,
        aura: currentUser.aura,
        tier: currentUser.tier
      },
      caption: postData.caption,
      mediaUrl: postData.mediaUrl,
      mediaType: postData.mediaType,
      videoDuration: postData.videoDuration,
      tags: postData.tags,
      auraGain: 0,
      plusVotes: 0,
      minusVotes: 0,
      userVote: null,
      createdAt: new Date().toISOString(),
      commentsCount: 0
    };

    setPosts(prev => [newPost, ...prev]);
    triggerConfettiBurst(currentUser.tier);
  };

  // SHOP: Buy cosmetic / utility item with Aura Coins
  const buyShopItem = (itemId: string): { success: boolean; message: string } => {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return { success: false, message: 'Item não encontrado.' };

    if (inventory.ownedItemIds.includes(itemId) && item.category !== 'streak_utility') {
      return { success: false, message: 'Já possuis este item!' };
    }

    if (inventory.coins < item.priceCoins) {
      return { success: false, message: `Saldo insuficiente! Precisas de ${item.priceCoins} Coins.` };
    }

    // Process Purchase
    if (soundEnabled) soundEffects.playAuraGain();
    triggerConfettiBurst(currentUser.tier);

    setInventory(prev => {
      const newCoins = prev.coins - item.priceCoins;
      const newOwned = prev.ownedItemIds.includes(itemId)
        ? prev.ownedItemIds
        : [...prev.ownedItemIds, itemId];
      
      let newFreezes = prev.streakFreezes;
      if (itemId === 'util_streak_freeze_pack') {
        newFreezes += 3;
      }

      // Auto equip if it's the first skin/title
      let equippedHalo = prev.equippedHaloSkinId;
      if (item.category === 'thematic_frame' || item.category === 'halo_skin') equippedHalo = item.id;

      let equippedTitle = prev.equippedBadgeTitle;
      if (item.category === 'badge_title') equippedTitle = item.badgeTitle;

      return {
        ...prev,
        coins: newCoins,
        streakFreezes: newFreezes,
        ownedItemIds: newOwned,
        equippedHaloSkinId: equippedHalo,
        equippedBadgeTitle: equippedTitle
      };
    });

    return { success: true, message: `Comprado com sucesso: ${item.name}!` };
  };

  // SHOP: Buy Coin Pack (Simulation of In-App Microtransaction)
  const buyCoinPack = (itemId: string) => {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return;

    if (soundEnabled) soundEffects.playAuraGain();
    triggerConfettiBurst('cosmic');

    setInventory(prev => ({
      ...prev,
      coins: prev.coins + item.priceCoins
    }));
  };

  // SHOP: Equip / Unequip
  const equipItem = (itemId: string, category: 'thematic_frame' | 'halo_skin' | 'badge_title' | 'video_effect') => {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return;

    setInventory(prev => {
      if (category === 'thematic_frame' || category === 'halo_skin') {
        return { ...prev, equippedHaloSkinId: item.id };
      }
      if (category === 'badge_title') {
        return { ...prev, equippedBadgeTitle: item.badgeTitle };
      }
      if (category === 'video_effect') {
        return { ...prev, equippedVideoEffectId: item.id };
      }
      return prev;
    });
  };

  const unequipItem = (category: 'thematic_frame' | 'halo_skin' | 'badge_title' | 'video_effect') => {
    setInventory(prev => {
      if (category === 'thematic_frame' || category === 'halo_skin') {
        return { ...prev, equippedHaloSkinId: undefined };
      }
      if (category === 'badge_title') {
        return { ...prev, equippedBadgeTitle: undefined };
      }
      if (category === 'video_effect') {
        return { ...prev, equippedVideoEffectId: undefined };
      }
      return prev;
    });
  };

  // Use Streak Freeze
  const useStreakFreeze = (): boolean => {
    if (inventory.streakFreezes <= 0) return false;
    setInventory(prev => ({
      ...prev,
      streakFreezes: Math.max(0, prev.streakFreezes - 1)
    }));
    return true;
  };

  // Switch User Profile (for testing & interactive demo)
  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
  };

  // Update profile
  const updateCurrentUserProfile = (profile: Partial<User>) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, ...profile };
      }
      return u;
    }));
  };

  // Reset to default initial state
  const resetAllData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_users`);
    localStorage.removeItem(`${STORAGE_KEY}_current_uid`);
    localStorage.removeItem(`${STORAGE_KEY}_posts`);
    localStorage.removeItem(`${STORAGE_KEY}_habits`);
    localStorage.removeItem(`${STORAGE_KEY}_logs`);
    localStorage.removeItem(`${STORAGE_KEY}_inventory`);
    setAllUsers(INITIAL_USERS);
    setCurrentUserId('user_alex');
    setPosts(INITIAL_POSTS);
    setHabits(INITIAL_HABITS);
    setAuraLogs(INITIAL_LOGS);
    setInventory(INITIAL_INVENTORY);
  };

  return (
    <AuraContext.Provider
      value={{
        currentUser,
        allUsers,
        posts,
        habits,
        auraLogs,
        inventory,
        currentTab,
        soundEnabled,
        floatingFeedbacks,
        setCurrentTab,
        setSoundEnabled,
        voteOnPost,
        toggleHabit,
        addHabit,
        createPost,
        buyShopItem,
        buyCoinPack,
        equipItem,
        unequipItem,
        useStreakFreeze,
        switchUser,
        updateCurrentUserProfile,
        resetAllData
      }}
    >
      {children}
    </AuraContext.Provider>
  );
};

export const useAura = () => {
  const context = useContext(AuraContext);
  if (!context) {
    throw new Error('useAura must be used within an AuraProvider');
  }
  return context;
};
