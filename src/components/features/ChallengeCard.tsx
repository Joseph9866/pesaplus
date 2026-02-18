import { LinearProgress } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';
import { ChallengeWithProgress } from '../../types';
import { Users, Trophy, Calendar } from 'lucide-react';
import { useFormattedCurrency } from '../../utils/currency';

interface ChallengeCardProps {
  challenge: ChallengeWithProgress;
  onJoin?: () => void;
  onView?: () => void;
}

export const ChallengeCard = ({ challenge, onJoin, onView }: ChallengeCardProps) => {
  const isParticipating = !!challenge.participant;
  const progress = isParticipating ? challenge.progress_percentage : 0;
  
  // Format currency amounts
  const formattedCurrentAmount = useFormattedCurrency(challenge.participant?.current_amount || 0);
  const formattedTargetAmount = useFormattedCurrency(challenge.target_amount);

  const getDaysRemaining = () => {
    const endDate = new Date(challenge.end_date);
    const today = new Date();
    const diff = endDate.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="bg-white rounded-md border border-[#E2E8F0] shadow-sm p-4 sm:p-6">
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 font-inter">{challenge.title}</h3>
              {isParticipating && (
                <Badge variant="secondary" className="text-xs">
                  Joined
                </Badge>
              )}
            </div>
            <p className="text-xs sm:text-sm text-[#64748B] font-inter">{challenge.description}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm">
          <div className="flex items-center gap-2 sm:gap-3">
            <Trophy size={14} className="sm:w-4 sm:h-4 text-[#F4B400]" />
            <span className="text-[#64748B] font-inter">{challenge.reward_entries} entries</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Users size={14} className="sm:w-4 sm:h-4 text-[#1FA774]" />
            <span className="text-[#64748B] font-inter">{challenge.participants_count} participants</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Calendar size={14} className="sm:w-4 sm:h-4 text-blue-600" />
            <span className="text-[#64748B] font-inter">{getDaysRemaining()} days left</span>
          </div>
        </div>

        {isParticipating && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm text-[#64748B] font-inter">Your Progress</span>
              <span className="text-xs sm:text-sm font-medium text-gray-900 font-inter">
                {formattedCurrentAmount} / {formattedTargetAmount}
              </span>
            </div>
            <LinearProgress percentage={progress} color="#1FA774" />
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {!isParticipating && onJoin && (
            <button
              onClick={onJoin}
              className="flex-1 h-10 px-4 sm:px-6 rounded-md font-medium transition-all duration-150 bg-[#1FA774] text-white hover:bg-[#1a8c62] hover:shadow-md font-inter text-sm sm:text-base"
            >
              Join Challenge
            </button>
          )}
          {onView && (
            <button
              onClick={onView}
              className={`flex-1 h-10 px-4 sm:px-6 rounded-md font-medium transition-all duration-150 font-inter text-sm sm:text-base ${
                isParticipating
                  ? 'bg-[#1FA774] text-white hover:bg-[#1a8c62] hover:shadow-md'
                  : 'border border-[#E2E8F0] text-gray-700 hover:border-gray-400 hover:shadow-md'
              }`}
            >
              View Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
