
import { useEffect, useRef } from 'react';

interface RouteVisualizationProps {
  path: any[];
  algorithm: string;
}

const RouteVisualization = ({ path, algorithm }: RouteVisualizationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !path.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background grid
    drawGrid(ctx, canvas.width, canvas.height);

    // Calculate bounds and scale
    const bounds = calculateBounds(path);
    const scale = calculateScale(bounds, canvas.width - 100, canvas.height - 100);
    const offsetX = 50;
    const offsetY = 50;

    // Draw connections between points
    drawConnections(ctx, path, bounds, scale, offsetX, offsetY);

    // Draw points
    drawPoints(ctx, path, bounds, scale, offsetX, offsetY);

    // Draw labels
    drawLabels(ctx, path, bounds, scale, offsetX, offsetY);

  }, [path, algorithm]);

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = '#ffffff20';
    ctx.lineWidth = 1;

    // Draw vertical lines
    for (let x = 0; x <= width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const calculateBounds = (points: any[]) => {
    const lats = points.map(p => p.lat || 0);
    const lngs = points.map(p => p.lng || 0);
    
    return {
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
      minLng: Math.min(...lngs),
      maxLng: Math.max(...lngs)
    };
  };

  const calculateScale = (bounds: any, width: number, height: number) => {
    const latRange = bounds.maxLat - bounds.minLat || 1;
    const lngRange = bounds.maxLng - bounds.minLng || 1;
    
    return Math.min(width / lngRange, height / latRange);
  };

  const drawConnections = (ctx: CanvasRenderingContext2D, points: any[], bounds: any, scale: number, offsetX: number, offsetY: number) => {
    if (points.length < 2) return;

    // Create gradient for the route line
    const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
    gradient.addColorStop(0, '#3b82f6');
    gradient.addColorStop(0.5, '#8b5cf6');
    gradient.addColorStop(1, '#06b6d4');

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw animated route
    ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const x = offsetX + (point.lng - bounds.minLng) * scale;
      const y = offsetY + (bounds.maxLat - point.lat) * scale;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Draw direction arrows
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      
      const x1 = offsetX + (current.lng - bounds.minLng) * scale;
      const y1 = offsetY + (bounds.maxLat - current.lat) * scale;
      const x2 = offsetX + (next.lng - bounds.minLng) * scale;
      const y2 = offsetY + (bounds.maxLat - next.lat) * scale;

      // Calculate arrow position (midpoint)
      const arrowX = (x1 + x2) / 2;
      const arrowY = (y1 + y2) / 2;

      // Calculate arrow direction
      const angle = Math.atan2(y2 - y1, x2 - x1);

      // Draw arrow
      ctx.save();
      ctx.translate(arrowX, arrowY);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(-5, -3);
      ctx.lineTo(5, 0);
      ctx.lineTo(-5, 3);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  };

  const drawPoints = (ctx: CanvasRenderingContext2D, points: any[], bounds: any, scale: number, offsetX: number, offsetY: number) => {
    points.forEach((point, index) => {
      const x = offsetX + (point.lng - bounds.minLng) * scale;
      const y = offsetY + (bounds.maxLat - point.lat) * scale;

      // Different colors for different point types
      let color = '#3b82f6';
      let size = 8;

      if (point.id === 'start') {
        color = '#10b981';
        size = 12;
      } else if (point.id === 'end') {
        color = '#ef4444';
        size = 12;
      } else if (point.fillLevel && point.fillLevel >= 90) {
        color = '#f59e0b';
        size = 10;
      }

      // Draw point shadow
      ctx.fillStyle = '#00000040';
      ctx.beginPath();
      ctx.arc(x + 2, y + 2, size, 0, 2 * Math.PI);
      ctx.fill();

      // Draw point
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fill();

      // Draw point border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw point number
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText((index + 1).toString(), x, y);
    });
  };

  const drawLabels = (ctx: CanvasRenderingContext2D, points: any[], bounds: any, scale: number, offsetX: number, offsetY: number) => {
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';

    points.forEach((point, index) => {
      const x = offsetX + (point.lng - bounds.minLng) * scale;
      const y = offsetY + (bounds.maxLat - point.lat) * scale;

      // Draw label background
      const label = point.location || `Point ${index + 1}`;
      const labelWidth = ctx.measureText(label).width + 10;
      const labelHeight = 20;

      ctx.fillStyle = '#00000080';
      ctx.fillRect(x - labelWidth / 2, y - 35, labelWidth, labelHeight);

      // Draw label text
      ctx.fillStyle = '#ffffff';
      ctx.fillText(label, x, y - 25);
    });
  };

  return (
    <div className="w-full h-96 bg-white/5 rounded-lg border border-white/20 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #0891b2 100%)' }}
      />
      <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-2 rounded-lg text-sm">
        Route optimized using {algorithm.toUpperCase()} algorithm
      </div>
    </div>
  );
};

export default RouteVisualization;
