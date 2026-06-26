import React, { useState } from 'react';

const HistoryTables = ({ investments = [], roiHistory = [], referralHistory = [] }) => {
    const [activeTab, setActiveTab] = useState('investments');

    // Helper function to format dates
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="w-full">
            {/* Tab Navigation */}
            <div className="flex space-x-4 border-b border-gray-200 mb-4 overflow-x-auto">
                <button
                    className={`py-2 px-4 font-medium text-sm transition-colors duration-200 ${activeTab === 'investments'
                            ? 'border-b-2 border-indigo-500 text-indigo-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => setActiveTab('investments')}
                >
                    Investments
                </button>
                <button
                    className={`py-2 px-4 font-medium text-sm transition-colors duration-200 ${activeTab === 'roi'
                            ? 'border-b-2 border-indigo-500 text-indigo-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => setActiveTab('roi')}
                >
                    ROI History
                </button>
                <button
                    className={`py-2 px-4 font-medium text-sm transition-colors duration-200 ${activeTab === 'referrals'
                            ? 'border-b-2 border-indigo-500 text-indigo-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => setActiveTab('referrals')}
                >
                    Referral Income
                </button>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>

                            {/* Render dynamic headers based on active tab */}
                            {activeTab === 'investments' && (
                                <>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan Details</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daily ROI %</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </>
                            )}
                            {activeTab === 'roi' && (
                                <>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Credited</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </>
                            )}
                            {activeTab === 'referrals' && (
                                <>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Earned</th>
                                </>
                            )}
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {activeTab === 'investments' && investments.length === 0 && (
                            <tr><td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No investments found.</td></tr>
                        )}

                        {activeTab === 'investments' && investments.map((inv) => (
                            <tr key={inv._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(inv.createdAt)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{inv.planDetails}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${inv.investmentAmount.toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inv.dailyRoiPercentage}%</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${inv.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {inv.status}
                                    </span>
                                </td>
                            </tr>
                        ))}

                        {/* Placeholder rows for the other tabs until their APIs are wired up */}
                        {activeTab === 'roi' && roiHistory.length === 0 && (
                            <tr><td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">No ROI history available yet.</td></tr>
                        )}
                        {activeTab === 'referrals' && referralHistory.length === 0 && (
                            <tr><td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">No referral income history available yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HistoryTables;