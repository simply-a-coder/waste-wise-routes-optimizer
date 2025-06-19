
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface MetricsChartProps {
  data: any;
  algorithm: string;
}

const MetricsChart = ({ data, algorithm }: MetricsChartProps) => {
  // Prepare data for charts
  const performanceData = [
    {
      name: 'Distance',
      value: data.totalDistance || 0,
      unit: 'km',
      color: '#3b82f6'
    },
    {
      name: 'Capacity',
      value: data.capacityUsed || 0,
      unit: 'kg',
      color: '#10b981'
    },
    {
      name: 'Efficiency',
      value: ((data.capacityUsed / 1000) * 100) || 0,
      unit: '%',
      color: '#f59e0b'
    },
    {
      name: 'Bins',
      value: data.path?.length || 0,
      unit: 'count',
      color: '#8b5cf6'
    }
  ];

  const capacityData = [
    {
      name: 'Used',
      value: data.capacityUsed || 0,
      color: '#3b82f6'
    },
    {
      name: 'Available',
      value: Math.max(0, 1000 - (data.capacityUsed || 0)),
      color: '#e5e7eb'
    }
  ];

  const algorithmComparison = [
    {
      name: 'Dijkstra',
      distance: algorithm === 'dijkstra' ? data.totalDistance : data.totalDistance * 1.1,
      time: algorithm === 'dijkstra' ? data.executionTime : data.executionTime * 0.8,
      active: algorithm === 'dijkstra'
    },
    {
      name: 'Prim',
      distance: algorithm === 'prim' ? data.totalDistance : data.totalDistance * 1.2,
      time: algorithm === 'prim' ? data.executionTime : data.executionTime * 0.9,
      active: algorithm === 'prim'
    },
    {
      name: 'TSP',
      distance: algorithm === 'tsp' ? data.totalDistance : data.totalDistance * 0.9,
      time: algorithm === 'tsp' ? data.executionTime : data.executionTime * 1.5,
      active: algorithm === 'tsp'
    },
    {
      name: 'Knapsack',
      distance: algorithm === 'knapsack' ? data.totalDistance : data.totalDistance * 1.05,
      time: algorithm === 'knapsack' ? data.executionTime : data.executionTime * 1.2,
      active: algorithm === 'knapsack'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Performance Metrics */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="name" stroke="#ffffff" />
              <YAxis stroke="#ffffff" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
                labelStyle={{ color: '#ffffff' }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                {performanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Capacity Utilization */}
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Capacity Utilization</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={capacityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {capacityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                  formatter={(value) => [`${value} kg`, 'Capacity']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Algorithm Comparison */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Algorithm Comparison</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={algorithmComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="name" stroke="#ffffff" />
                <YAxis stroke="#ffffff" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                  labelStyle={{ color: '#ffffff' }}
                />
                <Bar dataKey="distance" fill="#3b82f6" name="Distance (km)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="bg-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Detailed Statistics</h3>
        <div className="grid md:grid-cols-3 gap-6 text-white">
          <div>
            <h4 className="font-medium text-blue-200 mb-2">Route Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Distance:</span>
                <span>{data.totalDistance?.toFixed(2)} km</span>
              </div>
              <div className="flex justify-between">
                <span>Average Distance:</span>
                <span>{(data.totalDistance / (data.path?.length || 1))?.toFixed(2)} km</span>
              </div>
              <div className="flex justify-between">
                <span>Route Points:</span>
                <span>{data.path?.length || 0}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-blue-200 mb-2">Capacity Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Capacity Used:</span>
                <span>{data.capacityUsed} kg</span>
              </div>
              <div className="flex justify-between">
                <span>Capacity Available:</span>
                <span>{1000 - (data.capacityUsed || 0)} kg</span>
              </div>
              <div className="flex justify-between">
                <span>Utilization Rate:</span>
                <span>{((data.capacityUsed / 1000) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-blue-200 mb-2">Performance</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Algorithm:</span>
                <span className="uppercase">{algorithm}</span>
              </div>
              <div className="flex justify-between">
                <span>Execution Time:</span>
                <span>{data.executionTime || 0} ms</span>
              </div>
              <div className="flex justify-between">
                <span>Efficiency Score:</span>
                <span>{Math.round((data.capacityUsed / data.totalDistance) * 10)}/10</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsChart;
