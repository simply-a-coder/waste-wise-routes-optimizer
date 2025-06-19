
import { useEffect, useRef } from 'react';
import { setupCanvas, calculateBounds, calculateScale } from '@/utils/canvasUtils';
import { drawBackground, drawConnections, drawPoints } from '@/utils/drawingUtils';
import { adjustOverlappingPoints, drawLabels } from '@/utils/labelUtils';
import RouteInfoOverlay from './RouteInfoOverlay';

interface RouteVisualizationProps {
  path: any[];
  algorithm: string;
}

const RouteVisualization = ({ path, algorithm }: RouteVisualizationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !path.length) return;

    const canvasSetup = setupCanvas(canvasRef.current);
    if (!canvasSetup) return;

    const { ctx, width, height } = canvasSetup;

    // Draw background with better contrast
    drawBackground(ctx, width, height);

    // Calculate bounds and scale with padding
    const bounds = calculateBounds(path);
    const padding = 120;
    const scale = calculateScale(bounds, width - padding * 2, height - padding * 2);
    const offsetX = padding;
    const offsetY = padding;

    // Adjust overlapping points before drawing
    const adjustedPoints = adjustOverlappingPoints(path, bounds, scale, offsetX, offsetY);

    // Draw route elements in order for better layering
    drawConnections(ctx, adjustedPoints, bounds, scale, offsetX, offsetY);
    drawPoints(ctx, adjustedPoints, bounds, scale, offsetX, offsetY);
    drawLabels(ctx, adjustedPoints, bounds, scale, offsetX, offsetY);

  }, [path, algorithm]);

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg border border-white/20 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
      <RouteInfoOverlay algorithm={algorithm} stopCount={path.length} />
    </div>
  );
};

export default RouteVisualization;
