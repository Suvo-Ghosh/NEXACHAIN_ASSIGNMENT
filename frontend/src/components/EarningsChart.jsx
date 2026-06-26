import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EarningsChart = ({ stats }) => {
    // Format data for Recharts
    const data = [
        {
            name: 'Earnings',
            ROI: stats.totalRoiEarned,
            Referrals: stats.totalLevelIncomeEarned,
        }
    ];

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="ROI" stackId="a" fill="#8884d8" name="Total ROI Earned" />
                    <Bar dataKey="Referrals" stackId="a" fill="#82ca9d" name="Level Income Earned" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default EarningsChart;