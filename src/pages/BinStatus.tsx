
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Trash2, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { binService } from "@/services/binService";

const BinStatus = () => {
  const [formData, setFormData] = useState({
    location: "",
    dayOfWeek: "",
    wasteType: "",
    lastKnownFill: ""
  });
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    if (!formData.location || !formData.dayOfWeek || !formData.wasteType || !formData.lastKnownFill) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const result = await binService.predictBinStatus(formData);
      setPrediction(result);
    } catch (error) {
      console.error("Prediction failed:", error);
      alert("Prediction failed. Please try again.");
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
              <Trash2 className="h-8 w-8 text-white" />
              <span className="text-2xl font-bold text-white">Bin Status Predictor</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              AI Bin Status Prediction
            </h1>
            <p className="text-xl text-blue-100">
              Enter bin details to predict if it needs collection
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Card */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 animate-slide-in-right">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Bin Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="location" className="text-white">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Main Street Corner"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                  />
                </div>

                <div>
                  <Label htmlFor="dayOfWeek" className="text-white">Day of Week</Label>
                  <Select value={formData.dayOfWeek} onValueChange={(value) => setFormData({...formData, dayOfWeek: value})}>
                    <SelectTrigger className="bg-white/20 border-white/30 text-white">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Monday">Monday</SelectItem>
                      <SelectItem value="Tuesday">Tuesday</SelectItem>
                      <SelectItem value="Wednesday">Wednesday</SelectItem>
                      <SelectItem value="Thursday">Thursday</SelectItem>
                      <SelectItem value="Friday">Friday</SelectItem>
                      <SelectItem value="Saturday">Saturday</SelectItem>
                      <SelectItem value="Sunday">Sunday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="wasteType" className="text-white">Waste Type</Label>
                  <Select value={formData.wasteType} onValueChange={(value) => setFormData({...formData, wasteType: value})}>
                    <SelectTrigger className="bg-white/20 border-white/30 text-white">
                      <SelectValue placeholder="Select waste type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General">General Waste</SelectItem>
                      <SelectItem value="Recyclable">Recyclable</SelectItem>
                      <SelectItem value="Organic">Organic</SelectItem>
                      <SelectItem value="Hazardous">Hazardous</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="lastKnownFill" className="text-white">Last Known Fill Level (%)</Label>
                  <Input
                    id="lastKnownFill"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="e.g., 75"
                    value={formData.lastKnownFill}
                    onChange={(e) => setFormData({...formData, lastKnownFill: e.target.value})}
                    className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                  />
                </div>

                <Button 
                  onClick={handlePredict}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-3"
                >
                  {loading ? "Predicting..." : "Predict Bin Status"}
                  <Gauge className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>

            {/* Results Card */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 animate-slide-in-left">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Gauge className="h-5 w-5" />
                  Prediction Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {prediction ? (
                  <div className="space-y-6 animate-fade-in">
                    <div className="text-center">
                      <div className={`text-4xl font-bold mb-2 ${prediction.status === 'Full' ? 'text-red-400' : 'text-green-400'}`}>
                        {prediction.status}
                      </div>
                      <div className="text-white text-lg">
                        Confidence: {(prediction.confidence * 100).toFixed(0)}%
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-white">
                        <span>Fill Level Estimate</span>
                        <span>{prediction.estimatedFill}%</span>
                      </div>
                      <Progress 
                        value={prediction.estimatedFill} 
                        className="h-4 bg-white/20"
                      />
                    </div>

                    <div className="bg-white/20 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-2">Recommendation</h4>
                      <p className="text-blue-100">{prediction.recommendation}</p>
                    </div>

                    {prediction.status === 'Full' && (
                      <Link to="/route-selection">
                        <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                          Plan Collection Route
                        </Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-blue-100 py-12">
                    <Gauge className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Enter bin information and click "Predict" to see results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BinStatus;
