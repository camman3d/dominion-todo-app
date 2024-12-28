import React, { useState } from 'react';

interface Tab {
    id: number;
    label: string;
    content: React.ReactNode;
}

interface TabSelectorProps {
    children: Tab[];
    defaultTab?: number;
}

const TabSelector: React.FC<TabSelectorProps> = ({ children, defaultTab }) => {
    const [activeTab, setActiveTab] = useState(defaultTab);

    return (
        <div className="w-full">
            {/* Tab buttons */}
            <div className="flex flex-col md:flex-row border-b border-gray-200">
                {children.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 font-medium text-sm transition-colors duration-200
              ${activeTab === tab.id
                            ? 'text-white rounded-full md:rounded-none bg-shakespeare-500 md:bg-transparent md:text-shakespeare-500 md:border-b-2 md:border-shakespeare-500'
                            : 'text-gray-600 hover:text-shakespeare-500'
                        }`}
                        aria-selected={activeTab === tab.id}
                        role="tab"
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div className="mt-4">
                {children.find(tab => tab.id === activeTab)?.content}
            </div>
        </div>
    );
};

export default TabSelector;