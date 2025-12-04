import React from 'react';

interface BarChartProps {
    data: {
        label: string;
        value: number;
        color?: string;
    }[];
    height?: number;
    showValues?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({ data, height = 200, showValues = true }) => {
    const maxValue = Math.max(...data.map(d => d.value));

    return (
        <div className="w-full" style={{ height: `${height}px` }}>
            <div className="h-full flex items-end gap-2 md:gap-4">
                {data.map((item, index) => {
                    const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
                    return (
                        <div key={index} className="flex-1 flex flex-col items-center group relative">
                            {showValues && (
                                <div className="mb-2 text-xs font-medium text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6">
                                    {item.value}
                                </div>
                            )}
                            <div
                                className={`w-full rounded-t-lg transition-all duration-500 ease-out ${item.color || 'bg-blue-500'} hover:opacity-80`}
                                style={{ height: `${percentage}%` }}
                            />
                            <div className="mt-2 text-xs text-slate-500 truncate w-full text-center" title={item.label}>
                                {item.label}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BarChart;
