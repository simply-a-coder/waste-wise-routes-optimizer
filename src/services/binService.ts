
export interface BinStatusRequest {
  location: string;
  dayOfWeek: string;
  wasteType: string;
  lastKnownFill: string;
}

export interface BinStatusResponse {
  status: 'Full' | 'Not Full';
  confidence: number;
  estimatedFill: number;
  recommendation: string;
}

class BinService {
  async predictBinStatus(data: BinStatusRequest): Promise<BinStatusResponse> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Rule-based prediction logic
    const fillLevel = parseFloat(data.lastKnownFill);
    const wasteType = data.wasteType;
    const dayOfWeek = data.dayOfWeek;

    // Base prediction on fill level
    let estimatedFill = fillLevel;
    let confidence = 0.7;

    // Adjust based on day of week (weekends typically have higher accumulation)
    if (dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday') {
      estimatedFill += 10;
      confidence += 0.1;
    }

    // Adjust based on waste type
    switch (wasteType) {
      case 'General':
        estimatedFill += 5;
        break;
      case 'Recyclable':
        estimatedFill += 3;
        break;
      case 'Organic':
        estimatedFill += 8; // Organic waste accumulates faster
        break;
      case 'Hazardous':
        estimatedFill += 2;
        break;
    }

    // Adjust based on location patterns (simplified)
    if (data.location.toLowerCase().includes('main') || data.location.toLowerCase().includes('central')) {
      estimatedFill += 5; // High traffic areas
      confidence += 0.05;
    }

    // Cap at 100%
    estimatedFill = Math.min(estimatedFill, 100);
    confidence = Math.min(confidence, 0.95);

    const status = estimatedFill >= 80 ? 'Full' : 'Not Full';
    
    let recommendation = '';
    if (status === 'Full') {
      recommendation = 'Immediate collection recommended. Bin is likely at or near capacity.';
    } else if (estimatedFill >= 60) {
      recommendation = 'Schedule collection within 2-3 days to prevent overflow.';
    } else {
      recommendation = 'Bin has sufficient capacity. Collection can be scheduled normally.';
    }

    return {
      status,
      confidence,
      estimatedFill: Math.round(estimatedFill),
      recommendation
    };
  }
}

export const binService = new BinService();
