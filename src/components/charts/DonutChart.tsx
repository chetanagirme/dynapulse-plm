import React from 'react';

interface DonutChartProps {
    data: {
        label: string;
        value: number;
        color: string;
    }[];
    size?: number;
    thickness?: number;
}

const DonutChart: React.FC<DonutChartProps> = ({ data, size = 160, thickness = 20 }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    const radius = size / 2;
    const innerRadius = radius - thickness;

    const paths = data.map((item) => {
        const percentage = total > 0 ? item.value / total : 0;
        const startAngle = currentAngle;
        const endAngle = currentAngle + percentage * 2 * Math.PI;

        // Calculate path
        const x1 = Math.cos(startAngle) * radius + radius;
        const y1 = Math.sin(startAngle) * radius + radius;
        const x2 = Math.cos(endAngle) * radius + radius;
        const y2 = Math.sin(endAngle) * radius + radius;

        // Inner points
        const x3 = Math.cos(endAngle) * innerRadius + radius;
        const y3 = Math.sin(endAngle) * innerRadius + radius;
        const x4 = Math.cos(startAngle) * innerRadius + radius;
        const y4 = Math.sin(startAngle) * innerRadius + radius;

        const largeArcFlag = percentage > 0.5 ? 1 : 0;

        const pathData = [
            `M ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            `L ${x3} ${y3}`,
            `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
            'Z'
        ].join(' ');

        currentAngle += percentage * 2 * Math.PI;
        return { pathData, color: item.color, label: item.label, value: item.value, percentage };
    });

    return (
        <div className="flex items-center gap-8">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
                    {total === 0 && (
                        <circle
                            cx={radius}
                            cy={radius}
                            r={radius - thickness / 2}
                            fill="none"
                            stroke="#e2e8f0"
                            strokeWidth={thickness}
                        />
                    )}
                    {paths.map((path, index) => (
                        <path
                            key={index}
                            d={path.pathData}
                            fill={path.color}
                            className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                        >
                            <title>{`${path.label}: ${path.value} (${(path.percentage * 100).toFixed(1)}%)`}</title>
                        </path>
                    ))}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                    <span className="text-2xl font-bold text-slate-800">{total}</span>
                    <span className="text-xs text-slate-500">Total</span>
                </div>
            </div>
            <div className="space-y-2">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-slate-600">{item.label}</span>
                        <span className="text-sm font-medium text-slate-900 ml-auto">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DonutChart;
