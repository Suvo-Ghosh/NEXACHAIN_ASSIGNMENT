import React, { useState, useEffect } from 'react';
import { fetchDashboardData, fetchInvestments, fetchReferralTree, fetchRoiHistory, fetchReferralHistory } from '../services/api';
import DashboardCards from '../components/DashboardCards';
import EarningsChart from '../components/EarningsChart';
import HistoryTables from '../components/HistoryTables';
import ReferralTree from '../components/ReferralTree';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [dashboardStats, setDashboardStats] = useState(null);
    const [investments, setInvestments] = useState([]);
    const [referralTree, setReferralTree] = useState([]);
    const [roiHistory, setRoiHistory] = useState([]);
    const [referralHistory, setReferralHistory] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                // Fetch all data concurrently for better performance
                const [statsRes, investRes, treeRes, roiRes, refHistoryRes] = await Promise.all([
                    fetchDashboardData(),
                    fetchInvestments(),
                    fetchReferralTree(),
                    fetchRoiHistory(),
                    fetchReferralHistory()
                ]);

                setDashboardStats(statsRes.data.data);
                setInvestments(investRes.data.data);
                setReferralTree(treeRes.data.data);
                setRoiHistory(roiRes.data.data);
                setReferralHistory(refHistoryRes.data.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load dashboard data.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading your dashboard...</div>;
    if (error) return <div className="p-8 text-center text-red-500 bg-red-50 rounded">{error}</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800">Overview</h1>

            {/* Renders: Total Investments, Daily ROI, Total Level Income, Wallet Balance */}
            <DashboardCards stats={dashboardStats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Earnings Overview</h2>
                    <EarningsChart stats={dashboardStats} />
                </div>

                <div className="bg-white p-6 rounded-lg shadow overflow-y-auto max-h-96">
                    <h2 className="text-xl font-semibold mb-4">Referral Tree</h2>
                    <ReferralTree data={referralTree} />
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">History Overview</h2>
                <HistoryTables
                    investments={investments}
                    roiHistory={roiHistory}
                    referralHistory={referralHistory}
                />
            </div>
        </div>
    );
};

export default Dashboard;