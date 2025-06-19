
import { Link } from "react-router-dom";
import { Truck, MapPin, BarChart3, Route } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Truck className="h-8 w-8 text-white" />
              <span className="text-2xl font-bold text-white">WasteOptim</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link to="/" className="text-white hover:text-blue-200 transition-colors">Home</Link>
              <Link to="/bin-status" className="text-white hover:text-blue-200 transition-colors">Bin Status</Link>
              <Link to="/route-selection" className="text-white hover:text-blue-200 transition-colors">Route Optimizer</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-scale-in">
              AI-Driven Waste
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Management
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Optimize your waste collection routes with advanced algorithms and predict bin status using AI technology.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link to="/bin-status">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold transition-all hover:scale-105">
                  Check Bin Status
                  <MapPin className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/route-selection">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold transition-all hover:scale-105">
                  Optimize Routes
                  <Route className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 animate-fade-in">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AI Bin Prediction</h3>
              <p className="text-blue-100">Smart algorithms predict when bins will be full based on location, day, and waste type.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 animate-fade-in" style={{animationDelay: '0.1s'}}>
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                <Route className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Multi-Algorithm Optimization</h3>
              <p className="text-blue-100">Choose from Dijkstra, Prim, TSP, or Knapsack algorithms for optimal route planning.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Real-time Visualization</h3>
              <p className="text-blue-100">Interactive maps and animated visualizations show optimized routes in real-time.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
    </div>
  );
};

export default Index;
