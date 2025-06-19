
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Download, Map, BarChart3, Route as RouteIcon } from "lucide-react";
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

  const downloadReport = () => {
    if (!results) return;
    
    const reportData = {
      algorithm,
      timestamp: new Date().toISOString(),
      results,
      summary: {
        totalDistance: results.totalDistance,
        capacityUsed: results.capacityUsed,
        binsCollected: results.path?.length || 0,
        efficiency: ((results.capacityUsed / 1000) * 100).toFixed(1) + '%'
      }
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `route-optimization-report-${Date.now()}.json`;
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
                className="bg-white/20 hover:bg-white/30 text-white"
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
              Optimized using {algorithm.toUpperCase()} algorithm
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 animate-slide-in-left">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {results.totalDistance?.toFixed(1)} km
                </div>
                <div className="text-blue-100">Total Distance</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 animate-slide-in-left" style={{animationDelay: '0.1s'}}>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {results.capacityUsed} kg
                </div>
                <div className="text-blue-100">Capacity Used</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 animate-slide-in-left" style={{animationDelay: '0.2s'}}>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {results.path?.length || 0}
                </div>
                <div className="text-blue-100">Bins Collected</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 animate-slide-in-left" style={{animationDelay: '0.3s'}}>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  {((results.capacityUsed / 1000) * 100).toFixed(1)}%
                </div>
                <div className="text-blue-100">Efficiency</div>
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
                    Performance Analytics
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
