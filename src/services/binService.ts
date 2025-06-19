
export interface BinStatusRequest {
  location: string;
  dayOfWeek: string;
  wasteType: string;
  lastKnownFill: string;
  temperature?: number;
  humidity?: number;
  nearbyEvents?: string;
}

export interface BinStatusResponse {
  status: 'Full' | 'Not Full';
  confidence: number;
  estimatedFill: number;
  recommendation: string;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  estimatedTimeToFull: string;
  factors: string[];
}

class BinService {
  async predictBinStatus(data: BinStatusRequest): Promise<BinStatusResponse> {
    // Simulate AI processing with more realistic delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

    // Advanced multi-factor prediction logic
    const fillLevel = parseFloat(data.lastKnownFill);
    const wasteType = data.wasteType;
    const dayOfWeek = data.dayOfWeek;
    const location = data.location.toLowerCase();

    let estimatedFill = fillLevel;
    let confidence = 0.65; // Base confidence
    const factors: string[] = [];

    // Location-based factors (Dehradun specific)
    const locationFactors = {
      'rajpur road': { multiplier: 1.3, reason: 'High commercial activity' },
      'paltan bazaar': { multiplier: 1.4, reason: 'Dense market area' },
      'gandhi road': { multiplier: 1.2, reason: 'Business district' },
      'clock tower': { multiplier: 1.35, reason: 'Tourist hotspot' },
      'race course': { multiplier: 0.9, reason: 'Residential area' },
      'prem nagar': { multiplier: 0.8, reason: 'Suburban location' },
      'dehradun railway station': { multiplier: 1.5, reason: 'Transport hub' },
      'isbt': { multiplier: 1.45, reason: 'Bus terminal area' }
    };

    // Apply location factor
    for (const [loc, factor] of Object.entries(locationFactors)) {
      if (location.includes(loc)) {
        estimatedFill += (estimatedFill * (factor.multiplier - 1) * 0.5);
        factors.push(factor.reason);
        confidence += 0.08;
        break;
      }
    }

    // Day of week impact (Indian context)
    const dayFactors = {
      'Monday': { add: 8, reason: 'Monday morning accumulation' },
      'Tuesday': { add: 3, reason: 'Regular weekday' },
      'Wednesday': { add: 2, reason: 'Mid-week minimal' },
      'Thursday': { add: 5, reason: 'Pre-weekend preparation' },
      'Friday': { add: 12, reason: 'End of work week' },
      'Saturday': { add: 15, reason: 'Weekend shopping and activities' },
      'Sunday': { add: 10, reason: 'Weekend leisure activities' }
    };

    if (dayFactors[dayOfWeek as keyof typeof dayFactors]) {
      const dayFactor = dayFactors[dayOfWeek as keyof typeof dayFactors];
      estimatedFill += dayFactor.add;
      factors.push(dayFactor.reason);
      confidence += 0.1;
    }

    // Waste type specific prediction
    const wasteFactors = {
      'General': { rate: 1.2, decomp: 0.95, reason: 'Mixed waste with average decomposition' },
      'Recyclable': { rate: 0.8, decomp: 1.0, reason: 'Low decomposition, stable volume' },
      'Organic': { rate: 1.5, decomp: 0.7, reason: 'High volume, significant decomposition' },
      'Hazardous': { rate: 0.6, decomp: 1.0, reason: 'Controlled disposal, minimal volume' }
    };

    if (wasteFactors[wasteType as keyof typeof wasteFactors]) {
      const wasteFactor = wasteFactors[wasteType as keyof typeof wasteFactors];
      estimatedFill = (estimatedFill * wasteFactor.rate * wasteFactor.decomp);
      factors.push(wasteFactor.reason);
      confidence += 0.12;
    }

    // Weather simulation (monsoon effect in Dehradun)
    const currentMonth = new Date().getMonth();
    if (currentMonth >= 5 && currentMonth <= 9) { // Monsoon season
      estimatedFill += 5;
      factors.push('Monsoon season increases waste volume');
      confidence += 0.05;
    }

    // Festival/Event impact simulation
    const festivals = ['Diwali', 'Holi', 'Dussehra', 'Karva Chauth'];
    if (Math.random() > 0.7) { // Simulate festival period
      estimatedFill += 20;
      factors.push('Festival season increases waste generation');
      confidence += 0.1;
    }

    // Cap values
    estimatedFill = Math.min(Math.max(estimatedFill, 0), 100);
    confidence = Math.min(confidence, 0.98);

    // Determine status and urgency
    const status = estimatedFill >= 85 ? 'Full' : 'Not Full';
    let urgency: 'Low' | 'Medium' | 'High' | 'Critical';
    
    if (estimatedFill >= 95) urgency = 'Critical';
    else if (estimatedFill >= 85) urgency = 'High';
    else if (estimatedFill >= 65) urgency = 'Medium';
    else urgency = 'Low';

    // Time to full estimation
    const remainingCapacity = 100 - estimatedFill;
    const dailyFillRate = this.calculateDailyFillRate(wasteType, location);
    const daysToFull = Math.ceil(remainingCapacity / dailyFillRate);
    
    let estimatedTimeToFull: string;
    if (estimatedFill >= 95) {
      estimatedTimeToFull = 'Already full';
    } else if (daysToFull <= 1) {
      estimatedTimeToFull = 'Within 24 hours';
    } else if (daysToFull <= 3) {
      estimatedTimeToFull = `${daysToFull} days`;
    } else {
      estimatedTimeToFull = `${daysToFull} days`;
    }

    // Generate recommendation
    let recommendation: string;
    if (status === 'Full') {
      recommendation = `URGENT: Immediate collection required. Bin is at ${Math.round(estimatedFill)}% capacity with ${urgency.toLowerCase()} priority.`;
    } else if (estimatedFill >= 70) {
      recommendation = `Schedule collection within ${daysToFull} days. Current fill level trending upward.`;
    } else if (estimatedFill >= 50) {
      recommendation = `Monitor bin status. Collection can be scheduled normally within ${daysToFull} days.`;
    } else {
      recommendation = `Bin has sufficient capacity. Next collection in ${daysToFull} days or as per regular schedule.`;
    }

    return {
      status,
      confidence: Math.round(confidence * 100) / 100,
      estimatedFill: Math.round(estimatedFill),
      recommendation,
      urgency,
      estimatedTimeToFull,
      factors
    };
  }

  private calculateDailyFillRate(wasteType: string, location: string): number {
    const baseRates = {
      'General': 8,
      'Recyclable': 5,
      'Organic': 12,
      'Hazardous': 3
    };

    const locationMultiplier = location.includes('market') || location.includes('bazaar') || location.includes('road') ? 1.5 : 1.0;
    
    return (baseRates[wasteType as keyof typeof baseRates] || 8) * locationMultiplier;
  }
}

export const binService = new BinService();
