
import { RouteRequest, RouteResponse } from '@/services/routeService';

class DijkstraAlgorithm {
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
    
    // Apply Dijkstra's algorithm
    const shortestPath = this.dijkstra(distances, 0, allPoints.length - 1);
    
    // Build the optimized path
    const path = shortestPath.map(index => allPoints[index]);
    
    // Calculate total distance
    let totalDistance = 0;
    for (let i = 0; i < shortestPath.length - 1; i++) {
      totalDistance += distances[shortestPath[i]][shortestPath[i + 1]];
    }

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

  private dijkstra(distances: number[][], start: number, end: number): number[] {
    const n = distances.length;
    const dist = Array(n).fill(Infinity);
    const prev = Array(n).fill(-1);
    const visited = Array(n).fill(false);
    
    dist[start] = 0;

    for (let i = 0; i < n; i++) {
      let u = -1;
      for (let j = 0; j < n; j++) {
        if (!visited[j] && (u === -1 || dist[j] < dist[u])) {
          u = j;
        }
      }

      if (u === -1) break;
      visited[u] = true;

      for (let v = 0; v < n; v++) {
        if (!visited[v] && distances[u][v] > 0) {
          const alt = dist[u] + distances[u][v];
          if (alt < dist[v]) {
            dist[v] = alt;
            prev[v] = u;
          }
        }
      }
    }

    // Reconstruct path
    const path = [];
    let current = end;
    while (current !== -1) {
      path.unshift(current);
      current = prev[current];
    }

    return path;
  }
}

export const dijkstraAlgorithm = new DijkstraAlgorithm();
