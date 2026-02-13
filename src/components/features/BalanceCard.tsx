import { Card } from '../ui/Card';
import { ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { useFormattedCurrency } from '../../utils/currency';

interface BalanceCardProps {
  totalBalance: number;
  totalSaved: number;
  onDeposit: () => void;
}

export const BalanceCard = ({ totalBalance, totalSaved, onDeposit }: BalanceCardProps) => {
  const formattedBalance = useFormattedCurrency(totalBalance);
  const formattedSaved = useFormattedCurrency(totalSaved);
  const formattedAvailable = useFormattedCurrency(totalBalance - totalSaved);

  return (
    <Card className="bg-gradient-to-br from-primary to-primary/80 text-white">
      <div className="space-y-4">
        <div>
          <p className="text-white/80 text-sm">Total Balance</p>
          <h2 className="text-4xl font-bold mt-1">{formattedBalance}</h2>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-1 text-white/80 text-sm">
              <ArrowUpRight size={16} />
              <span>Saved</span>
            </div>
            <p className="text-xl font-semibold mt-1 text-secondary">
              {formattedSaved}
            </p>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1 text-white/80 text-sm">
              <ArrowDownRight size={16} />
              <span>Available</span>
            </div>
            <p className="text-xl font-semibold mt-1">
              {formattedAvailable}
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            onClick={onDeposit}
            className="flex-1 bg-white text-primary hover:bg-white/90"
          >
            <Plus size={18} className="mr-1" />
            Deposit
          </Button>
        </div>
      </div>
    </Card>
  );
};
