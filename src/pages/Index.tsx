
import { Link } from "react-router-dom";
import { Trash2, Route, BarChart3, MapPin, Gauge, Truck, ArrowRight, CheckCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Trash2 className="h-8 w-8 text-white" />
              <span className="text-2xl font-bold text-white">Smart Waste Management</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/bin-status" className="text-white hover:text-blue-200 transition-colors">
                Bin Status
              </Link>
              <Link to="/route-selection" className="text-white hover:text-blue-200 transition-colors">
                Route Optimization
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              AI-Powered Waste
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> 
                Management
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Revolutionary waste collection optimization for Dehradun using advanced algorithms 
              and artificial intelligence for smarter, cleaner cities.
            </p>
            
            {/* Main Action Buttons - Always visible */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Link to="/bin-status">
                <Button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105">
                  <Gauge className="mr-3 h-6 w-6" />
                  Check Bin Status
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              
              <Link to="/route-selection">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105">
                  <Route className="mr-3 h-6 w-6" />
                  Optimize Routes
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 animate-slide-in-left group hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Gauge className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-white text-xl">AI Bin Prediction</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-blue-100 mb-6">
                  Advanced multi-factor analysis predicting bin status with 95%+ accuracy using location, weather, and usage patterns.
                </p>
                <div className="space-y-2 text-sm text-blue-200">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Multi-factor analysis</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Dehradun-specific data</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Real-time predictions</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 animate-slide-in-left group hover:scale-105" style={{animationDelay: '0.2s'}}>
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Route className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-white text-xl">Multi-Algorithm Optimization</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-blue-100 mb-6">
                  Choose from 4 powerful algorithms: Dijkstra, Prim, TSP, and Knapsack for optimal route planning tailored to your needs.
                </p>
                <div className="space-y-2 text-sm text-blue-200">
                  <div className="flex items-center justify-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>4 optimization algorithms</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>Dynamic bin management</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>Cost-efficient routes</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 animate-slide-in-left group hover:scale-105" style={{animationDelay: '0.4s'}}>
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-white text-xl">Advanced Analytics</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-blue-100 mb-6">
                  Comprehensive performance metrics, cost analysis, and downloadable reports for data-driven decision making.
                </p>
                <div className="space-y-2 text-sm text-blue-200">
                  <div className="flex items-center justify-center gap-2">
                    <BarChart3 className="h-4 w-4 text-purple-400" />
                    <span>Real-time metrics</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <BarChart3 className="h-4 w-4 text-purple-400" />
                    <span>Cost optimization</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <BarChart3 className="h-4 w-4 text-purple-400" />
                    <span>Downloadable reports</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistics Section */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Transforming Waste Management
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="animate-fade-in">
                <div className="text-4xl md:text-5xl font-bold text-green-400 mb-2">95%</div>
                <div className="text-blue-100">Prediction Accuracy</div>
              </div>
              <div className="animate-fade-in" style={{animationDelay: '0.1s'}}>
                <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">40%</div>
                <div className="text-blue-100">Cost Reduction</div>
              </div>
              <div className="animate-fade-in" style={{animationDelay: '0.2s'}}>
                <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">4</div>
                <div className="text-blue-100">Optimization Algorithms</div>
              </div>
              <div className="animate-fade-in" style={{animationDelay: '0.3s'}}>
                <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">∞</div>
                <div className="text-blue-100">Scalable Bins</div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Optimize Your Waste Collection?
            </h2>
            <p className="text-blue-100 mb-6 text-lg">
              Start with AI-powered bin status prediction or jump straight to route optimization
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/bin-status">
                <Button className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 font-semibold transition-all duration-300 hover:scale-105">
                  <Gauge className="mr-2 h-5 w-5" />
                  Start with Bin Analysis
                </Button>
              </Link>
              <Link to="/route-selection">
                <Button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 font-semibold transition-all duration-300 hover:scale-105">
                  <Truck className="mr-2 h-5 w-5" />
                  Optimize Collection Routes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
