import { Card } from '../ui/Card';
import { LinearProgress, CircularProgress } from '../ui/ProgressBar';
import { Goal } from '../../types';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { useFormattedCurrency } from '../../utils/currency';

interface GoalCardProps {
  goal: Goal;
  onClick: () => void;
  variant?: 'linear' | 'circular';
}

export const GoalCard = ({ goal, onClick, variant = 'linear' }: GoalCardProps) => {
  const percentage = (goal.current_amount / goal.target_amount) * 100;
  
  // Format currency amounts
  const formattedCurrentAmount = useFormattedCurrency(goal.current_amount);
  const formattedTargetAmount = useFormattedCurrency(goal.target_amount);

  const getDaysRemaining = () => {
    const deadline = new Date(goal.deadline);
    const today = new Date();
    const diff = deadline.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const IconComponent = (Icons[goal.icon as keyof typeof Icons] || Icons.Target) as LucideIcon;

  if (variant === 'circular') {
    return (
      <Card onClick={onClick} hover className="flex flex-col items-center text-center p-6">
        <div className="mb-4">
          <CircularProgress
            percentage={percentage}
            color={goal.color}
            size={100}
            strokeWidth={10}
          />
        </div>
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
          style={{ backgroundColor: `${goal.color}20` }}
        >
          <IconComponent size={24} style={{ color: goal.color }} />
        </div>
        <h3 className="font-semibold text-text mb-1">{goal.title}</h3>
        <p className="text-sm text-text-secondary mb-2">
          {formattedCurrentAmount} of {formattedTargetAmount}
        </p>
        <p className="text-xs text-text-secondary">
          {getDaysRemaining()} days left
        </p>
      </Card>
    );
  }

  return (
    <Card onClick={onClick} hover>
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${goal.color}20` }}
        >
          <IconComponent size={24} style={{ color: goal.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-text">{goal.title}</h3>
              <p className="text-sm text-text-secondary mt-1">
                {formattedCurrentAmount} of {formattedTargetAmount}
              </p>
            </div>
            <span className="text-sm font-medium text-text-secondary">
              {Math.round(percentage)}%
            </span>
          </div>
          <LinearProgress percentage={percentage} color={goal.color} />
          <p className="text-xs text-text-secondary mt-2">
            {getDaysRemaining()} days remaining
          </p>
        </div>
      </div>
    </Card>
  );
};
