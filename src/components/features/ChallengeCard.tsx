import { Card } from '../ui/Card';
import { LinearProgress } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';
import { ChallengeWithProgress } from '../../types';
import { Users, Trophy, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
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
    <Card>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-text">{challenge.title}</h3>
              {isParticipating && (
                <Badge variant="secondary" className="text-xs">
                  Joined
                </Badge>
              )}
            </div>
            <p className="text-sm text-text-secondary">{challenge.description}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2 text-text-secondary">
            <Trophy size={16} className="text-accent" />
            <span>{challenge.reward_entries} entries</span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <Users size={16} className="text-secondary" />
            <span>{challenge.participants_count} participants</span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <Calendar size={16} className="text-primary" />
            <span>{getDaysRemaining()} days left</span>
          </div>
        </div>

        {isParticipating && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-secondary">Your Progress</span>
              <span className="text-sm font-medium text-text">
                {formattedCurrentAmount} / {formattedTargetAmount}
              </span>
            </div>
            <LinearProgress percentage={progress} color="#1FA774" />
          </div>
        )}

        <div className="flex gap-3">
          {!isParticipating && onJoin && (
            <Button onClick={onJoin} fullWidth>
              Join Challenge
            </Button>
          )}
          {onView && (
            <Button onClick={onView} variant={isParticipating ? 'primary' : 'secondary'} fullWidth>
              View Details
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
