import React, { useState } from 'react';
import { AuraProvider, useAura } from './context/AuraContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { FeedView } from './components/FeedView';
import { DisciplineView } from './components/DisciplineView';
import { LeaderboardView } from './components/LeaderboardView';
import { ShopView } from './components/ShopView';
import { ProfileView } from './components/ProfileView';
import { CreatePostModal } from './components/CreatePostModal';
import { DatabaseArchitectureModal } from './components/DatabaseArchitectureModal';
import { FloatingAuraLayer } from './components/FloatingAuraLayer';

const MainAppContent: React.FC = () => {
  const { currentTab } = useAura();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-amber-400 selection:text-black">
      {/* Dynamic Floating Feedback Aura Layer (+100 / -50 Aura notifications) */}
      <FloatingAuraLayer />

      {/* Top Header Navbar */}
      <Navbar onOpenArchitecture={() => setIsArchitectureOpen(true)} />

      {/* Main View Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3.5 sm:px-6 pt-4">
        {currentTab === 'feed' && (
          <FeedView onOpenCreatePost={() => setIsCreatePostOpen(true)} />
        )}

        {currentTab === 'discipline' && (
          <DisciplineView />
        )}

        {currentTab === 'shop' && (
          <ShopView />
        )}

        {currentTab === 'leaderboard' && (
          <LeaderboardView />
        )}

        {currentTab === 'profile' && (
          <ProfileView />
        )}
      </main>

      {/* Bottom Floating Navigation (Mobile-First) */}
      <BottomNav onOpenCreatePost={() => setIsCreatePostOpen(true)} />

      {/* Create Aura Post Modal */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
      />

      {/* Database & Architecture Specification Modal */}
      <DatabaseArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuraProvider>
      <MainAppContent />
    </AuraProvider>
  );
}
