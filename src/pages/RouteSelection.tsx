
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Route, Settings, MapPin, Truck, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { routeService } from "@/services/routeService";

interface BinData {
  id: string;
  location: string;
  fillLevel: number;
  lat: number;
  lng: number;
}

const RouteSelection = () => {
  const [algorithm, setAlgorithm] = useState("");
  const [truckCapacity, setTruckCapacity] = useState("1000");
  const [startPoint, setStartPoint] = useState({ lat: "", lng: "" });
  const [endPoint, setEndPoint] = useState({ lat: "", lng: "" });
  const [selectedBins, setSelectedBins] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [customBins, setCustomBins] = useState<BinData[]>([]);
  const [newBinForm, setNewBinForm] = useState({
    location: "",
    fillLevel: "",
    lat: "",
    lng: ""
  });

  // Dehradun-specific bin locations
  const [availableBins, setAvailableBins] = useState<BinData[]>([
    { id: "bin1", location: "Rajpur Road Market", fillLevel: 85, lat: 30.3165, lng: 78.0322 },
    { id: "bin2", location: "Paltan Bazaar Junction", fillLevel: 92, lat: 30.3255, lng: 78.0367 },
    { id: "bin3", location: "Gandhi Road Circle", fillLevel: 78, lat: 30.3209, lng: 78.0348 },
    { id: "bin4", location: "Clock Tower Area", fillLevel: 95, lat: 30.3165, lng: 78.0322 },
    { id: "bin5", location: "Race Course Market", fillLevel: 88, lat: 30.3045, lng: 78.0445 },
    { id: "bin6", location: "Prem Nagar Chowk", fillLevel: 72, lat: 30.2967, lng: 78.0436 },
    { id: "bin7", location: "ISBT Dehradun", fillLevel: 89, lat: 30.3074, lng: 78.0519 },
    { id: "bin8", location: "Dehradun Railway Station", fillLevel: 91, lat: 30.3398, lng: 78.0427 }
  ]);

  const allBins = [...availableBins, ...customBins];

  const handleBinSelection = (binId: string, checked: boolean) => {
    if (checked) {
      setSelectedBins([...selectedBins, binId]);
    } else {
      setSelectedBins(selectedBins.filter(id => id !== binId));
    }
  };

  const addCustomBin = () => {
    if (!newBinForm.location || !newBinForm.fillLevel) {
      alert("Please fill in location and fill level");
      return;
    }

    const newBin: BinData = {
      id: `custom_${Date.now()}`,
      location: newBinForm.location,
      fillLevel: parseInt(newBinForm.fillLevel),
      lat: parseFloat(newBinForm.lat) || (30.3165 + (Math.random() - 0.5) * 0.1),
      lng: parseFloat(newBinForm.lng) || (78.0322 + (Math.random() - 0.5) * 0.1)
    };

    setCustomBins([...customBins, newBin]);
    setNewBinForm({ location: "", fillLevel: "", lat: "", lng: "" });
  };

  const removeBin = (binId: string) => {
    if (binId.startsWith('custom_')) {
      setCustomBins(customBins.filter(bin => bin.id !== binId));
    } else {
      setAvailableBins(availableBins.filter(bin => bin.id !== binId));
    }
    setSelectedBins(selectedBins.filter(id => id !== binId));
  };

  const handleOptimize = async () => {
    if (!algorithm || selectedBins.length === 0) {
      alert("Please select an algorithm and at least one bin");
      return;
    }

    setLoading(true);
    try {
      const bins = allBins.filter(bin => selectedBins.includes(bin.id));
      const result = await routeService.optimizeRoute({
        algorithm,
        bins,
        truckCapacity: parseInt(truckCapacity),
        startPoint: { 
          lat: parseFloat(startPoint.lat) || 30.3165, 
          lng: parseFloat(startPoint.lng) || 78.0322 
        },
        endPoint: { 
          lat: parseFloat(endPoint.lat) || 30.3165, 
          lng: parseFloat(endPoint.lng) || 78.0322 
        }
      });

      // Navigate to results with the optimization data
      window.location.href = `/results?algorithm=${algorithm}&data=${encodeURIComponent(JSON.stringify(result))}`;
    } catch (error) {
      console.error("Optimization failed:", error);
      alert("Route optimization failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Route className="h-8 w-8 text-white" />
              <span className="text-2xl font-bold text-white">Route Optimizer</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Dehradun Waste Collection Route Optimizer
            </h1>
            <p className="text-xl text-blue-100">
              Select bins across Dehradun and optimize your collection route
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Algorithm Selection */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 animate-slide-in-left">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Algorithm & Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="algorithm" className="text-white">Choose Algorithm</Label>
                  <Select value={algorithm} onValueChange={setAlgorithm}>
                    <SelectTrigger className="bg-white/20 border-white/30 text-white">
                      <SelectValue placeholder="Select algorithm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dijkstra">Dijkstra (Shortest Path)</SelectItem>
                      <SelectItem value="prim">Prim (Minimum Spanning Tree)</SelectItem>
                      <SelectItem value="tsp">TSP (Traveling Salesman)</SelectItem>
                      <SelectItem value="knapsack">Knapsack (Capacity Optimization)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="capacity" className="text-white">Truck Capacity (kg)</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={truckCapacity}
                    onChange={(e) => setTruckCapacity(e.target.value)}
                    className="bg-white/20 border-white/30 text-white"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Start Point (Optional)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Latitude"
                        value={startPoint.lat}
                        onChange={(e) => setStartPoint({...startPoint, lat: e.target.value})}
                        className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                      />
                      <Input
                        placeholder="Longitude"
                        value={startPoint.lng}
                        onChange={(e) => setStartPoint({...startPoint, lng: e.target.value})}
                        className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-white">End Point (Optional)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Latitude"
                        value={endPoint.lat}
                        onChange={(e) => setEndPoint({...endPoint, lat: e.target.value})}
                        className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                      />
                      <Input
                        placeholder="Longitude"
                        value={endPoint.lng}
                        onChange={(e) => setEndPoint({...endPoint, lng: e.target.value})}
                        className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bin Selection and Management */}
            <Card className="lg:col-span-2 bg-white/10 backdrop-blur-md border-white/20 animate-slide-in-right">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Manage Bins in Dehradun ({allBins.length} total)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add New Bin */}
                <div className="mb-6 p-4 bg-white/10 rounded-lg border border-white/20">
                  <h4 className="text-white font-semibold mb-3">Add New Bin Location</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="e.g., Mussoorie Road Junction"
                      value={newBinForm.location}
                      onChange={(e) => setNewBinForm({...newBinForm, location: e.target.value})}
                      className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                    />
                    <Input
                      type="number"
                      placeholder="Fill Level (%)"
                      min="0"
                      max="100"
                      value={newBinForm.fillLevel}
                      onChange={(e) => setNewBinForm({...newBinForm, fillLevel: e.target.value})}
                      className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                    />
                    <Input
                      placeholder="Latitude (optional)"
                      value={newBinForm.lat}
                      onChange={(e) => setNewBinForm({...newBinForm, lat: e.target.value})}
                      className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                    />
                    <Input
                      placeholder="Longitude (optional)"
                      value={newBinForm.lng}
                      onChange={(e) => setNewBinForm({...newBinForm, lng: e.target.value})}
                      className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                    />
                  </div>
                  <Button
                    onClick={addCustomBin}
                    className="mt-3 bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Bin
                  </Button>
                </div>

                {/* Bin List */}
                <div className="grid md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {allBins.map((bin) => (
                    <div
                      key={bin.id}
                      className="flex items-center space-x-3 p-4 bg-white/10 rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
                    >
                      <Checkbox
                        id={bin.id}
                        checked={selectedBins.includes(bin.id)}
                        onCheckedChange={(checked) => handleBinSelection(bin.id, checked as boolean)}
                      />
                      <div className="flex-1">
                        <label htmlFor={bin.id} className="text-white font-medium cursor-pointer">
                          {bin.location}
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="text-sm text-blue-200">Fill: {bin.fillLevel}%</div>
                          <div className={`px-2 py-1 rounded text-xs ${
                            bin.fillLevel >= 90 ? 'bg-red-500/20 text-red-200' :
                            bin.fillLevel >= 75 ? 'bg-yellow-500/20 text-yellow-200' :
                            'bg-green-500/20 text-green-200'
                          }`}>
                            {bin.fillLevel >= 90 ? 'Critical' :
                             bin.fillLevel >= 75 ? 'High' : 'Medium'}
                          </div>
                          {bin.id.startsWith('custom_') && (
                            <button
                              onClick={() => removeBin(bin.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white">Selected Bins: {selectedBins.length}</span>
                    <span className="text-blue-200">
                      Est. Load: {allBins
                        .filter(bin => selectedBins.includes(bin.id))
                        .reduce((sum, bin) => sum + (bin.fillLevel * 10), 0)}kg
                    </span>
                  </div>
                  
                  <Button 
                    onClick={handleOptimize}
                    disabled={loading || !algorithm || selectedBins.length === 0}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-3"
                  >
                    {loading ? "Optimizing..." : "Optimize Route"}
                    <Truck className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteSelection;
