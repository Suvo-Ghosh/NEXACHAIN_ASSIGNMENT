import React from 'react';

const DashboardCards = ({ stats }) => {
  if (!stats) return null;

  const cardData = [
    {
      title: 'Wallet Balance',
      value: stats.walletBalance,
      prefix: '$',
      color: 'border-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Investments',
      value: stats.totalInvestments,
      prefix: '$',
      color: 'border-indigo-500',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Total ROI Earned',
      value: stats.totalRoiEarned,
      prefix: '$',
      color: 'border-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Level Income',
      value: stats.totalLevelIncomeEarned,
      prefix: '$',
      color: 'border-purple-500',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cardData.map((card, index) => (
        <div 
          key={index} 
          className={`bg-white p-6 rounded-lg shadow-sm border-t-4 ${card.color} flex flex-col justify-between`}
        >
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">
            {card.title}
          </h3>
          <div className="mt-2 flex items-baseline text-3xl font-bold text-gray-900">
            <span className={`mr-1 text-xl font-semibold ${card.textColor}`}>
              {card.prefix}
            </span>
            {/* Format numbers to 2 decimal places for currency */}
            {Number(card.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;