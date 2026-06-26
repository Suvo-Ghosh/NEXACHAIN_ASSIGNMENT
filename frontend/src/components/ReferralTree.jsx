import React from 'react';

// Recursive Node Component
const TreeNode = ({ node }) => {
    const { userInfo, level, downline } = node;

    return (
        <div className="ml-4 mt-2 border-l-2 border-gray-200 pl-4">
            <div className="flex items-center space-x-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">
                    Level {level}
                </span>
                <span className="font-medium text-gray-700">{userInfo.fullName}</span>
                <span className="text-sm text-gray-500">({userInfo.referralCode})</span>
            </div>

            {/* Recursively render downlines if they exist */}
            {downline && downline.length > 0 && (
                <div className="mt-2">
                    {downline.map((childNode) => (
                        <TreeNode key={childNode.userInfo._id} node={childNode} />
                    ))}
                </div>
            )}
        </div>
    );
};

// Main Tree Wrapper
const ReferralTree = ({ data }) => {
    if (!data || data.length === 0) {
        return <p className="text-gray-500 italic">No referrals found.</p>;
    }

    return (
        <div className="space-y-4 text-sm">
            {data.map((rootNode) => (
                <TreeNode key={rootNode.userInfo._id} node={rootNode} />
            ))}
        </div>
    );
};

export default ReferralTree;