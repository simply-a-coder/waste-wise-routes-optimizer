
import { RouteRequest, RouteResponse } from '@/services/routeService';

class PrimAlgorithm {
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
    
    // Apply Prim's algorithm to find minimum spanning tree
    const mst = this.prim(distances);
    
    // Convert MST to a traversal path
    const path = this.mstToPath(mst, allPoints);
    
    // Calculate total distance
    const totalDistance = mst.reduce((sum, edge) => sum + edge.weight, 0);

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

  private prim(distances: number[][]): { from: number; to: number; weight: number }[] {
    const n = distances.length;
    const visited = Array(n).fill(false);
    const mst: { from: number; to: number; weight: number }[] = [];
    
    // Start with vertex 0
    visited[0] = true;
    
    for (let i = 0; i < n - 1; i++) {
      let minWeight = Infinity;
      let minFrom = -1;
      let minTo = -1;
      
      // Find minimum weight edge connecting visited to unvisited vertex
      for (let u = 0; u < n; u++) {
        if (visited[u]) {
          for (let v = 0; v < n; v++) {
            if (!visited[v] && distances[u][v] > 0 && distances[u][v] < minWeight) {
              minWeight = distances[u][v];
              minFrom = u;
              minTo = v;
            }
          }
        }
      }
      
      if (minTo !== -1) {
        visited[minTo] = true;
        mst.push({ from: minFrom, to: minTo, weight: minWeight });
      }
    }
    
    return mst;
  }

  private mstToPath(mst: { from: number; to: number; weight: number }[], points: any[]): any[] {
    // Convert MST to a depth-first traversal starting from node 0
    const adjacencyList: number[][] = Array(points.length).fill(null).map(() => []);
    
    // Build adjacency list from MST
    mst.forEach(edge => {
      adjacencyList[edge.from].push(edge.to);
      adjacencyList[edge.to].push(edge.from);
    });
    
    // DFS traversal
    const visited = Array(points.length).fill(false);
    const path: number[] = [];
    
    const dfs = (node: number) => {
      visited[node] = true;
      path.push(node);
      
      adjacencyList[node].forEach(neighbor => {
        if (!visited[neighbor]) {
          dfs(neighbor);
        }
      });
    };
    
    dfs(0); // Start from the first node (start point)
    
    return path.map(index => points[index]);
  }
}

export const primAlgorithm = new PrimAlgorithm();
