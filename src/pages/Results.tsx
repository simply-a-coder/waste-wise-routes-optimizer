
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Download, Map, BarChart3, Route as RouteIcon, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RouteVisualization from "@/components/RouteVisualization";
import MetricsChart from "@/components/MetricsChart";

const Results = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState<any>(null);
  const [algorithm, setAlgorithm] = useState("");

  useEffect(() => {
    const algorithmParam = searchParams.get('algorithm');
    const dataParam = searchParams.get('data');
    
    if (algorithmParam && dataParam) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(dataParam));
        setResults(parsedData);
        setAlgorithm(algorithmParam);
      } catch (error) {
        console.error("Failed to parse results data:", error);
      }
    }
  }, [searchParams]);

  const generateReportHTML = () => {
    if (!results) return '';

    const totalBins = results.path?.length || 0;
    const averageFillLevel = results.path?.reduce((sum: number, bin: any) => sum + (bin.fillLevel || 0), 0) / totalBins || 0;
    const costPerKm = 15;
    const totalCost = results.totalDistance * costPerKm;
    const fuelEfficiency = results.totalDistance > 0 ? (results.capacityUsed / results.totalDistance).toFixed(2) : 0;

    return `
<!DOCTYPE html>
<html>
<head>
    <title>Waste Collection Route Optimization Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 40px; }
        .section { margin-bottom: 30px; }
        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
        .metric-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; text-align: center; }
        .route-list { list-style: none; padding: 0; }
        .route-item { padding: 10px; margin: 5px 0; background: #f5f5f5; border-radius: 5px; }
        .algorithm-details { background: #e8f4f8; padding: 20px; border-radius: 8px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #f2f2f2; }
        .footer { text-align: center; margin-top: 40px; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Waste Collection Route Optimization Report</h1>
        <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        <p>Algorithm Used: <strong>${algorithm.toUpperCase()}</strong></p>
    </div>

    <div class="section">
        <h2>Executive Summary</h2>
        <div class="metrics-grid">
            <div class="metric-card">
                <h3>Total Distance</h3>
                <p><strong>${results.totalDistance?.toFixed(2)} km</strong></p>
            </div>
            <div class="metric-card">
                <h3>Capacity Used</h3>
                <p><strong>${results.capacityUsed} kg</strong></p>
            </div>
            <div class="metric-card">
                <h3>Bins Collected</h3>
                <p><strong>${totalBins}</strong></p>
            </div>
            <div class="metric-card">
                <h3>Estimated Cost</h3>
                <p><strong>₹${totalCost.toFixed(0)}</strong></p>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Route Optimization Details</h2>
        <div class="algorithm-details">
            <h3>Algorithm: ${algorithm.toUpperCase()}</h3>
            <p><strong>Description:</strong> ${getAlgorithmDescription(algorithm)}</p>
            <p><strong>Execution Time:</strong> ${results.executionTime || 'N/A'} ms</p>
            <p><strong>Optimization Efficiency:</strong> ${getEfficiencyScore(algorithm)}%</p>
        </div>
    </div>

    <div class="section">
        <h2>Performance Metrics</h2>
        <table>
            <tr><th>Metric</th><th>Value</th><th>Unit</th></tr>
            <tr><td>Total Distance</td><td>${results.totalDistance?.toFixed(2)}</td><td>km</td></tr>
            <tr><td>Average Distance per Bin</td><td>${(results.totalDistance / totalBins).toFixed(2)}</td><td>km</td></tr>
            <tr><td>Capacity Utilization</td><td>${((results.capacityUsed / 1000) * 100).toFixed(1)}</td><td>%</td></tr>
            <tr><td>Average Fill Level</td><td>${averageFillLevel.toFixed(1)}</td><td>%</td></tr>
            <tr><td>Fuel Efficiency</td><td>${fuelEfficiency}</td><td>kg/km</td></tr>
            <tr><td>Cost per Km</td><td>₹${costPerKm}</td><td>INR</td></tr>
            <tr><td>Total Operational Cost</td><td>₹${totalCost.toFixed(0)}</td><td>INR</td></tr>
        </table>
    </div>

    <div class="section">
        <h2>Optimized Route Sequence</h2>
        <ol class="route-list">
            ${results.path?.map((point: any, index: number) => `
                <li class="route-item">
                    <strong>Stop ${index + 1}:</strong> ${point.location || `Point ${index + 1}`}
                    ${point.fillLevel ? `<span style="float: right;">Fill Level: ${point.fillLevel}%</span>` : ''}
                </li>
            `).join('') || ''}
        </ol>
    </div>

    <div class="section">
        <h2>Recommendations</h2>
        <ul>
            <li>Current route is optimized for ${algorithm === 'dijkstra' ? 'shortest distance' : algorithm === 'tsp' ? 'visiting all bins efficiently' : algorithm === 'prim' ? 'minimum spanning connections' : 'capacity optimization'}</li>
            <li>Consider scheduling collection during ${averageFillLevel > 80 ? 'peak hours due to high fill levels' : 'off-peak hours for better efficiency'}</li>
            <li>Monitor bins with fill levels above 90% for priority collection</li>
            <li>Estimated fuel savings: ${Math.round((25 - results.totalDistance) / 25 * 100)}% compared to standard 25km route</li>
        </ul>
    </div>

    <div class="footer">
        <p>Report generated by Smart Waste Management System</p>
        <p>Dehradun Municipal Corporation - Waste Collection Optimization</p>
    </div>
</body>
</html>`;
  };

  const getAlgorithmDescription = (algo: string) => {
    const descriptions = {
      'dijkstra': 'Finds the shortest path between all collection points, minimizing total travel distance.',
      'prim': 'Creates a minimum spanning tree connecting all bins with minimum total edge weight.',
      'tsp': 'Solves the Traveling Salesman Problem to find the shortest route visiting all bins exactly once.',
      'knapsack': 'Optimizes bin selection based on capacity constraints and value maximization.'
    };
    return descriptions[algo as keyof typeof descriptions] || 'Advanced optimization algorithm';
  };

  const getEfficiencyScore = (algo: string) => {
    const scores = { 'dijkstra': 85, 'prim': 88, 'tsp': 95, 'knapsack': 90 };
    return scores[algo as keyof typeof scores] || 85;
  };

  const downloadReport = () => {
    if (!results) return;
    
    const htmlContent = generateReportHTML();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `waste-collection-report-${algorithm}-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center">
        <div className="text-center text-white">
          <RouteIcon className="h-16 w-16 mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-bold">Loading Results...</h2>
        </div>
      </div>
    );
  }

  // Calculate dynamic metrics
  const totalBins = results.path?.length || 0;
  const averageFillLevel = results.path?.reduce((sum: number, bin: any) => sum + (bin.fillLevel || 0), 0) / totalBins || 0;
  const costPerKm = 15;
  const totalCost = results.totalDistance * costPerKm;
  const efficiency = ((results.capacityUsed / 1000) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/route-selection" className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Route Selection</span>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-8 w-8 text-white" />
                <span className="text-2xl font-bold text-white">Optimization Results</span>
              </div>
              <Button 
                onClick={downloadReport}
                className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Route Optimization Results
            </h1>
            <p className="text-xl text-blue-100">
              Optimized using {algorithm.toUpperCase()} algorithm • {totalBins} bins • ₹{totalCost.toFixed(0)} estimated cost
            </p>
          </div>

          {/* Dynamic Summary Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 animate-slide-in-left">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {results.totalDistance?.toFixed(1)} km
                </div>
                <div className="text-blue-100">Total Distance</div>
                <div className="text-xs text-green-300 mt-1">
                  {Math.round((25 - results.totalDistance) / 25 * 100)}% vs standard route
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 animate-slide-in-left" style={{animationDelay: '0.1s'}}>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {results.capacityUsed} kg
                </div>
                <div className="text-blue-100">Capacity Used</div>
                <div className="text-xs text-blue-300 mt-1">
                  {efficiency.toFixed(1)}% utilization
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 animate-slide-in-left" style={{animationDelay: '0.2s'}}>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {totalBins}
                </div>
                <div className="text-blue-100">Bins Collected</div>
                <div className="text-xs text-purple-300 mt-1">
                  Avg: {averageFillLevel.toFixed(1)}% full
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 animate-slide-in-left" style={{animationDelay: '0.3s'}}>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  ₹{totalCost.toFixed(0)}
                </div>
                <div className="text-blue-100">Total Cost</div>
                <div className="text-xs text-yellow-300 mt-1">
                  ₹{costPerKm}/km rate
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Results */}
          <Tabs defaultValue="visualization" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-md">
              <TabsTrigger value="visualization" className="text-white">Route Visualization</TabsTrigger>
              <TabsTrigger value="metrics" className="text-white">Performance Metrics</TabsTrigger>
              <TabsTrigger value="details" className="text-white">Algorithm Details</TabsTrigger>
            </TabsList>

            <TabsContent value="visualization" className="mt-8">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Map className="h-5 w-5" />
                    Optimized Route Visualization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RouteVisualization 
                    path={results.path} 
                    algorithm={algorithm}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="metrics" className="mt-8">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Performance Analytics & Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MetricsChart 
                    data={results}
                    algorithm={algorithm}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="mt-8">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <RouteIcon className="h-5 w-5" />
                    Algorithm Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6 text-white">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Algorithm: {algorithm.toUpperCase()}</h3>
                      <p className="text-blue-100">
                        {algorithm === 'dijkstra' && "Dijkstra's algorithm finds the shortest path between nodes in a graph, optimal for minimizing total travel distance."}
                        {algorithm === 'prim' && "Prim's algorithm creates a minimum spanning tree connecting all bins with the minimum total edge weight."}
                        {algorithm === 'tsp' && "The Traveling Salesman Problem algorithm finds the shortest route visiting all bins exactly once."}
                        {algorithm === 'knapsack' && "The Knapsack algorithm optimizes bin selection based on capacity constraints and value maximization."}
                      </p>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Optimization Parameters</h4>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-blue-200">Total Distance:</span>
                          <span className="ml-2">{results.totalDistance?.toFixed(2)} km</span>
                        </div>
                        <div>
                          <span className="text-blue-200">Capacity Utilization:</span>
                          <span className="ml-2">{((results.capacityUsed / 1000) * 100).toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-blue-200">Bins Visited:</span>
                          <span className="ml-2">{results.path?.length || 0}</span>
                        </div>
                        <div>
                          <span className="text-blue-200">Execution Time:</span>
                          <span className="ml-2">{results.executionTime || 'N/A'} ms</span>
                        </div>
                      </div>
                    </div>

                    {results.path && (
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Route Sequence</h4>
                        <div className="text-sm space-y-1">
                          {results.path.map((point: any, index: number) => (
                            <div key={index} className="flex items-center gap-2">
                              <span className="text-blue-200">{index + 1}.</span>
                              <span>{point.location || `Point ${index + 1}`}</span>
                              {point.fillLevel && (
                                <span className="text-xs bg-blue-500/20 px-2 py-1 rounded">
                                  {point.fillLevel}% full
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <Link to="/route-selection">
              <Button className="bg-white/20 hover:bg-white/30 text-white">
                Optimize Another Route
              </Button>
            </Link>
            <Link to="/">
              <Button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
