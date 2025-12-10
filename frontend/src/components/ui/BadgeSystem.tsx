import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Zap, Target, Award, Crown, Medal, Flame } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  progress?: number;
  maxProgress?: number;
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
}

const badgeIcons = {
  trophy: Trophy,
  star: Star,
  zap: Zap,
  target: Target,
  award: Award,
  crown: Crown,
  medal: Medal,
  flame: Flame,
};

const tierColors = {
  bronze: 'from-orange-600 to-orange-400',
  silver: 'from-gray-400 to-gray-300',
  gold: 'from-yellow-500 to-yellow-300',
  platinum: 'from-purple-600 to-purple-400',
};

interface BadgeCardProps {
  badge: UserBadge;
  onClick?: () => void;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge, onClick }) => {
  const Icon = badgeIcons[badge.icon as keyof typeof badgeIcons] || Trophy;
  const tierGradient = badge.tier ? tierColors[badge.tier] : 'from-gray-400 to-gray-300';

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'relative p-6 rounded-2xl border-2 transition-all cursor-pointer',
        badge.earned
          ? 'bg-gradient-to-br from-white to-gray-50 border-gray-300 shadow-lg'
          : 'bg-gray-100 border-gray-200 opacity-60'
      )}
    >
      <div className="flex flex-col items-center text-center space-y-3">
        <div
          className={cn(
            'w-20 h-20 rounded-full flex items-center justify-center',
            badge.earned
              ? `bg-gradient-to-br ${tierGradient} text-white shadow-xl`
              : 'bg-gray-300 text-gray-500'
          )}
        >
          <Icon className="w-10 h-10" />
        </div>

        <div>
          <h3 className="font-bold text-gray-900">{badge.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
        </div>

        {badge.earned && badge.earnedDate && (
          <p className="text-xs text-gray-500">
            Earned on {new Date(badge.earnedDate).toLocaleDateString()}
          </p>
        )}

        {!badge.earned && badge.progress !== undefined && badge.maxProgress !== undefined && (
          <div className="w-full">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>{badge.progress}/{badge.maxProgress}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-600 to-secondary-600 transition-all"
                style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {badge.earned && (
        <div className="absolute -top-2 -right-2">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
            <Star className="w-4 h-4 text-white fill-white" />
          </div>
        </div>
      )}
    </motion.div>
  );
};

interface BadgeSystemProps {
  badges: UserBadge[];
  showOnlyEarned?: boolean;
}

export const BadgeSystem: React.FC<BadgeSystemProps> = ({ badges, showOnlyEarned = false }) => {
  const displayBadges = showOnlyEarned ? badges.filter(b => b.earned) : badges;
  const earnedCount = badges.filter(b => b.earned).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Achievement Badges</h2>
          <p className="text-gray-600">
            {earnedCount} of {badges.length} badges earned
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <span className="text-3xl font-bold text-gray-900">{earnedCount}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayBadges.map((badge) => (
          <BadgeCard key={badge.id} badge={badge} />
        ))}
      </div>

      {displayBadges.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Trophy className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p>No badges to display</p>
        </div>
      )}
    </div>
  );
};

export const mockBadges: UserBadge[] = [
  {
    id: '1',
    name: 'First Event',
    description: 'Attended your first event',
    icon: 'star',
    earned: true,
    earnedDate: '2024-01-15',
    tier: 'bronze',
  },
  {
    id: '2',
    name: 'Event Enthusiast',
    description: 'Attended 5 events',
    icon: 'flame',
    earned: true,
    earnedDate: '2024-02-20',
    tier: 'silver',
  },
  {
    id: '3',
    name: 'Super Fan',
    description: 'Attended 10 events',
    icon: 'trophy',
    earned: false,
    progress: 7,
    maxProgress: 10,
    tier: 'gold',
  },
  {
    id: '4',
    name: 'Early Bird',
    description: 'Booked 3 events in advance',
    icon: 'zap',
    earned: true,
    earnedDate: '2024-03-01',
    tier: 'bronze',
  },
  {
    id: '5',
    name: 'VIP Member',
    description: 'Attended 20 events',
    icon: 'crown',
    earned: false,
    progress: 7,
    maxProgress: 20,
    tier: 'platinum',
  },
  {
    id: '6',
    name: 'Social Butterfly',
    description: 'Shared 5 events with friends',
    icon: 'target',
    earned: false,
    progress: 2,
    maxProgress: 5,
    tier: 'silver',
  },
];
