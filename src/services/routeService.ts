
import { dijkstraAlgorithm } from '@/algorithms/dijkstra';
import { primAlgorithm } from '@/algorithms/prim';
import { tspAlgorithm } from '@/algorithms/tsp';
import { knapsackAlgorithm } from '@/algorithms/knapsack';

export interface Bin {
  id: string;
  location: string;
  fillLevel: number;
  lat: number;
  lng: number;
}

export interface RouteRequest {
  algorithm: string;
  bins: Bin[];
  truckCapacity: number;
  startPoint: { lat: number; lng: number };
  endPoint: { lat: number; lng: number };
}

export interface RouteResponse {
  path: any[];
  totalDistance: number;
  capacityUsed: number;
  executionTime: number;
}

class RouteService {
  async optimizeRoute(request: RouteRequest): Promise<RouteResponse> {
    const startTime = Date.now();
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    let result: RouteResponse;

    switch (request.algorithm) {
      case 'dijkstra':
        result = await dijkstraAlgorithm.solve(request);
        break;
      case 'prim':
        result = await primAlgorithm.solve(request);
        break;
      case 'tsp':
        result = await tspAlgorithm.solve(request);
        break;
      case 'knapsack':
        result = await knapsackAlgorithm.solve(request);
        break;
      default:
        throw new Error(`Unknown algorithm: ${request.algorithm}`);
    }

    const executionTime = Date.now() - startTime;
    result.executionTime = executionTime;

    return result;
  }
}

export const routeService = new RouteService();
