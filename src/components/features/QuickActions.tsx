import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Receipt, Wallet, TrendingUp, ArrowRight } from 'lucide-react';

export const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: Receipt,
      title: 'Transactions',
      description: 'View your transaction history',
      path: '/transactions',
      color: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: Wallet,
      title: 'Loans',
      description: 'Manage your loans',
      path: '/loans',
      color: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      icon: TrendingUp,
      title: 'Investments',
      description: 'Track your investments',
      path: '/investments',
      color: 'from-green-500 to-green-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-[#0F2A44] flex items-center gap-2">
        <div className="w-1 h-6 bg-[#F4B400] rounded-full"></div>
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Card
              key={action.path}
              className="p-6 cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-[#F4B400] group"
              onClick={() => navigate(action.path)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${action.iconBg}`}>
                  <Icon className={action.iconColor} size={24} />
                </div>
                <ArrowRight className="text-gray-400 group-hover:text-[#F4B400] transition-colors" size={20} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
