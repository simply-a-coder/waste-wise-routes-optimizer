
import { RouteRequest, RouteResponse } from '@/services/routeService';

class TSPAlgorithm {
  async solve(request: RouteRequest): Promise<RouteResponse> {
    const { bins, startPoint, endPoint } = request;
    
    // Create all points (start, bins, end)
    const allPoints = [
      { id: 'start', location: 'Start Point', lat: startPoint.lat, lng: startPoint.lng, fillLevel: 0 },
      ...bins,
      { id: 'end', location: 'End Point', lat: endPoint.lat, lng: endPoint.lng, fillLevel: 0 }
    ];

    // Calculate distances between all points
    const distances = this.calculateDistanceMatrix(allPoints);
    
    // Solve TSP using nearest neighbor heuristic (for performance)
    const tour = this.nearestNeighborTSP(distances);
    
    // Build the optimized path
    const path = tour.map(index => allPoints[index]);
    
    // Calculate total distance
    let totalDistance = 0;
    for (let i = 0; i < tour.length - 1; i++) {
      totalDistance += distances[tour[i]][tour[i + 1]];
    }
    
    // Add distance back to start to complete the tour
    totalDistance += distances[tour[tour.length - 1]][tour[0]];

    // Calculate capacity used
    const capacityUsed = bins.reduce((sum, bin) => sum + (bin.fillLevel * 10), 0);

    return {
      path,
      totalDistance,
      capacityUsed,
      executionTime: 0 // Will be set by the service
    };
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

  private nearestNeighborTSP(distances: number[][]): number[] {
    const n = distances.length;
    const visited = Array(n).fill(false);
    const tour: number[] = [];
    
    // Start from the first city (start point)
    let currentCity = 0;
    visited[currentCity] = true;
    tour.push(currentCity);
    
    // Visit all cities using nearest neighbor heuristic
    for (let i = 0; i < n - 1; i++) {
      let nearestCity = -1;
      let minDistance = Infinity;
      
      for (let j = 0; j < n; j++) {
        if (!visited[j] && distances[currentCity][j] < minDistance) {
          minDistance = distances[currentCity][j];
          nearestCity = j;
        }
      }
      
      if (nearestCity !== -1) {
        visited[nearestCity] = true;
        tour.push(nearestCity);
        currentCity = nearestCity;
      }
    }
    
    return tour;
  }

  // Alternative: 2-opt improvement heuristic
  private twoOptImprovement(tour: number[], distances: number[][]): number[] {
    const n = tour.length;
    let improved = true;
    let bestTour = [...tour];
    
    while (improved) {
      improved = false;
      
      for (let i = 0; i < n - 1; i++) {
        for (let j = i + 1; j < n; j++) {
          // Try swapping edges
          const newTour = [...bestTour];
          
          // Reverse the segment between i and j
          for (let k = i, l = j; k < l; k++, l--) {
            [newTour[k], newTour[l]] = [newTour[l], newTour[k]];
          }
          
          // Calculate new distance
          const oldDistance = this.calculateTourDistance(bestTour, distances);
          const newDistance = this.calculateTourDistance(newTour, distances);
          
          if (newDistance < oldDistance) {
            bestTour = newTour;
            improved = true;
          }
        }
      }
    }
    
    return bestTour;
  }

  private calculateTourDistance(tour: number[], distances: number[][]): number {
    let totalDistance = 0;
    for (let i = 0; i < tour.length - 1; i++) {
      totalDistance += distances[tour[i]][tour[i + 1]];
    }
    totalDistance += distances[tour[tour.length - 1]][tour[0]]; // Return to start
    return totalDistance;
  }
}

export const tspAlgorithm = new TSPAlgorithm();
