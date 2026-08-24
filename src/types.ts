export type AuraTier = 'npc' | 'rising' | 'god' | 'cosmic';

export interface AuraTierConfig {
  id: AuraTier;
  name: string;
  minAura: number;
  maxAura: number;
  color: string;
  glowClass: string;
  borderClass: string;
  badgeBg: string;
  badgeText: string;
  description: string;
  title: string;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  aura: number;
  tier: AuraTier;
  dailyAuraEarned: number;
  socialAuraEarned: number;
  disciplineAuraEarned: number;
  streak: number;
  lastActiveDate: string;
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    aura: number;
    tier: AuraTier;
  };
  caption: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  videoDuration?: number; // In seconds, maximum 8.0s
  thumbnailUrl?: string;
  tags: string[];
  auraGain: number; // Net total aura points earned from this post
  plusVotes: number;
  minusVotes: number;
  userVote?: '+aura' | '-aura' | null;
  createdAt: string;
  commentsCount: number;
}

export interface Habit {
  id: string;
  userId: string;
  title: string;
  category: 'fitness' | 'mind' | 'routine' | 'diet' | 'productivity';
  icon: string;
  auraReward: number;
  completedDates: string[]; // List of YYYY-MM-DD
  streak: number;
  description?: string;
}

export interface AuraLog {
  id: string;
  userId: string;
  amount: number;
  source: 'habit' | 'post_vote_received' | 'post_vote_given' | 'streak_bonus' | 'level_up' | 'welcome';
  description: string;
  timestamp: string;
}

export interface VoteRecord {
  postId: string;
  userId: string;
  voteType: '+aura' | '-aura';
  timestamp: string;
}

export type ViewTab = 'feed' | 'discipline' | 'leaderboard' | 'shop' | 'profile';

export type ShopItemCategory = 'thematic_frame' | 'halo_skin' | 'video_effect' | 'badge_title' | 'streak_utility' | 'coins_pack';

export interface ShopItem {
  id: string;
  name: string;
  category: ShopItemCategory;
  description: string;
  priceCoins: number; // in Aura Coins
  realPriceEur?: string; // e.g. "€2.99"
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  themeType?: 'hellfire' | 'cyberpunk' | 'glacial' | 'abyssal' | 'carbon' | 'vaporwave' | 'spartan';
  glowClass?: string;
  customRingStyle?: string;
  frameDecoration?: string; // Special icon/shape overlay
  badgeTitle?: string;
  previewColor?: string;
  isPopular?: boolean;
}

export interface UserInventory {
  coins: number;
  streakFreezes: number;
  ownedItemIds: string[];
  equippedHaloSkinId?: string;
  equippedBadgeTitle?: string;
  equippedVideoEffectId?: string;
}
