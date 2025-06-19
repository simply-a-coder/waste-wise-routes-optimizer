
import { RouteRequest, RouteResponse } from '@/services/routeService';

class KnapsackAlgorithm {
  async solve(request: RouteRequest): Promise<RouteResponse> {
    const { bins, truckCapacity, startPoint, endPoint } = request;
    
    // Calculate value and weight for each bin
    const items = bins.map(bin => ({
      ...bin,
      weight: bin.fillLevel * 10, // Weight based on fill level
      value: this.calculateBinValue(bin) // Value based on priority factors
    }));

    // Solve knapsack problem to select optimal bins
    const selectedItems = this.knapsack(items, truckCapacity);
    
    // Create route including start and end points
    const allPoints = [
      { id: 'start', location: 'Start Point', lat: startPoint.lat, lng: startPoint.lng, fillLevel: 0 },
      ...selectedItems,
      { id: 'end', location: 'End Point', lat: endPoint.lat, lng: endPoint.lng, fillLevel: 0 }
    ];

    // Calculate distances and create optimal path
    const distances = this.calculateDistanceMatrix(allPoints);
    const path = this.nearestNeighborPath(distances, allPoints);
    
    // Calculate total distance
    let totalDistance = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const currentIndex = allPoints.findIndex(p => p.id === path[i].id);
      const nextIndex = allPoints.findIndex(p => p.id === path[i + 1].id);
      totalDistance += distances[currentIndex][nextIndex];
    }

    // Calculate capacity used
    const capacityUsed = selectedItems.reduce((sum, item) => sum + item.weight, 0);

    return {
      path,
      totalDistance,
      capacityUsed,
      executionTime: 0 // Will be set by the service
    };
  }

  private calculateBinValue(bin: any): number {
    // Value calculation based on multiple factors
    let value = 0;
    
    // Higher fill level = higher value
    value += bin.fillLevel * 2;
    
    // Location-based value (high traffic areas have higher priority)
    if (bin.location.toLowerCase().includes('main') || 
        bin.location.toLowerCase().includes('central') ||
        bin.location.toLowerCase().includes('avenue')) {
      value += 50;
    }
    
    // Critical fill level gets bonus value
    if (bin.fillLevel >= 90) {
      value += 100;
    } else if (bin.fillLevel >= 75) {
      value += 50;
    }
    
    return value;
  }

  private knapsack(items: any[], capacity: number): any[] {
    const n = items.length;
    const dp: number[][] = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));
    
    // Build table dp[][] in bottom-up manner
    for (let i = 0; i <= n; i++) {
      for (let w = 0; w <= capacity; w++) {
        if (i === 0 || w === 0) {
          dp[i][w] = 0;
        } else if (items[i - 1].weight <= w) {
          dp[i][w] = Math.max(
            items[i - 1].value + dp[i - 1][w - items[i - 1].weight],
            dp[i - 1][w]
          );
        } else {
          dp[i][w] = dp[i - 1][w];
        }
      }
    }
    
    // Backtrack to find which items to include
    const selectedItems: any[] = [];
    let w = capacity;
    
    for (let i = n; i > 0 && w > 0; i--) {
      if (dp[i][w] !== dp[i - 1][w]) {
        selectedItems.push(items[i - 1]);
        w -= items[i - 1].weight;
      }
    }
    
    return selectedItems;
  }

  private calculateDistanceMatrix(points: any[]): number[][] {
    const n = points.length;
    const distances: number[][] = Array(n).fill(null).map(() => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          distances[i][j] = this.haversineDistance(
            points[i].lat, points[i].lng,
            points[j].lat, points[j].lng
          );
        }
      }
    }

    return distances;
  }

  private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private nearestNeighborPath(distances: number[][], points: any[]): any[] {
    const n = points.length;
    const visited = Array(n).fill(false);
    const path: any[] = [];
    
    // Start from the first point (start point)
    let currentIndex = 0;
    visited[currentIndex] = true;
    path.push(points[currentIndex]);
    
    // Visit all points using nearest neighbor
    for (let i = 0; i < n - 1; i++) {
      let nearestIndex = -1;
      let minDistance = Infinity;
      
      for (let j = 0; j < n; j++) {
        if (!visited[j] && distances[currentIndex][j] < minDistance) {
          minDistance = distances[currentIndex][j];
          nearestIndex = j;
        }
      }
      
      if (nearestIndex !== -1) {
        visited[nearestIndex] = true;
        path.push(points[nearestIndex]);
        currentIndex = nearestIndex;
      }
    }
    
    return path;
  }
}

export const knapsackAlgorithm = new KnapsackAlgorithm();
