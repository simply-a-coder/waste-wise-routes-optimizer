
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

    // Set canvas size with device pixel ratio for clarity
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw background with better contrast
    drawBackground(ctx, rect.width, rect.height);

    // Calculate bounds and scale with padding
    const bounds = calculateBounds(path);
    const padding = 80;
    const scale = calculateScale(bounds, rect.width - padding * 2, rect.height - padding * 2);
    const offsetX = padding;
    const offsetY = padding;

    // Draw route elements in order for better layering
    drawConnections(ctx, path, bounds, scale, offsetX, offsetY);
    drawPoints(ctx, path, bounds, scale, offsetX, offsetY);
    drawLabels(ctx, path, bounds, scale, offsetX, offsetY);

  }, [path, algorithm]);

  const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Create gradient background
    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2);
    gradient.addColorStop(0, '#1e3a8a');
    gradient.addColorStop(0.5, '#7c3aed');
    gradient.addColorStop(1, '#0891b2');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw subtle grid
    ctx.strokeStyle = '#ffffff15';
    ctx.lineWidth = 1;
    
    for (let x = 0; x <= width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    for (let y = 0; y <= height; y += 40) {
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
    const latRange = bounds.maxLat - bounds.minLat || 0.01;
    const lngRange = bounds.maxLng - bounds.minLng || 0.01;
    
    return Math.min(width / lngRange, height / latRange) * 0.8; // 0.8 for some margin
  };

  const drawConnections = (ctx: CanvasRenderingContext2D, points: any[], bounds: any, scale: number, offsetX: number, offsetY: number) => {
    if (points.length < 2) return;

    // Draw route line with glow effect
    ctx.shadowColor = '#3b82f6';
    ctx.shadowBlur = 10;
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

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

    // Reset shadow
    ctx.shadowBlur = 0;

    // Draw direction arrows with better visibility
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth = 2;

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      
      const x1 = offsetX + (current.lng - bounds.minLng) * scale;
      const y1 = offsetY + (bounds.maxLat - current.lat) * scale;
      const x2 = offsetX + (next.lng - bounds.minLng) * scale;
      const y2 = offsetY + (bounds.maxLat - next.lat) * scale;

      // Calculate arrow position (3/4 along the line)
      const arrowX = x1 + (x2 - x1) * 0.75;
      const arrowY = y1 + (y2 - y1) * 0.75;

      // Calculate arrow direction
      const angle = Math.atan2(y2 - y1, x2 - x1);

      // Draw arrow with outline
      ctx.save();
      ctx.translate(arrowX, arrowY);
      ctx.rotate(angle);
      
      // Arrow outline
      ctx.beginPath();
      ctx.moveTo(-8, -5);
      ctx.lineTo(8, 0);
      ctx.lineTo(-8, 5);
      ctx.closePath();
      ctx.stroke();
      
      // Arrow fill
      ctx.fill();
      
      ctx.restore();
    }
  };

  const drawPoints = (ctx: CanvasRenderingContext2D, points: any[], bounds: any, scale: number, offsetX: number, offsetY: number) => {
    points.forEach((point, index) => {
      const x = offsetX + (point.lng - bounds.minLng) * scale;
      const y = offsetY + (bounds.maxLat - point.lat) * scale;

      // Determine point style
      let color = '#3b82f6';
      let size = 10;
      let borderColor = '#ffffff';

      if (point.id === 'start') {
        color = '#10b981';
        size = 14;
        borderColor = '#ffffff';
      } else if (point.id === 'end') {
        color = '#ef4444';
        size = 14;
        borderColor = '#ffffff';
      } else if (point.fillLevel && point.fillLevel >= 90) {
        color = '#f59e0b';
        size = 12;
        borderColor = '#ffffff';
      }

      // Draw point shadow
      ctx.fillStyle = '#00000060';
      ctx.beginPath();
      ctx.arc(x + 3, y + 3, size, 0, 2 * Math.PI);
      ctx.fill();

      // Draw point with glow
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fill();

      // Draw point border
      ctx.shadowBlur = 0;
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw point number with better visibility
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.strokeText((index + 1).toString(), x, y);
      ctx.fillText((index + 1).toString(), x, y);
    });
  };

  const drawLabels = (ctx: CanvasRenderingContext2D, points: any[], bounds: any, scale: number, offsetX: number, offsetY: number) => {
    ctx.font = '13px Arial';
    ctx.textAlign = 'center';

    points.forEach((point, index) => {
      const x = offsetX + (point.lng - bounds.minLng) * scale;
      const y = offsetY + (bounds.maxLat - point.lat) * scale;

      // Truncate long location names
      let label = point.location || `Point ${index + 1}`;
      if (label.length > 20) {
        label = label.substring(0, 17) + '...';
      }

      // Measure text for background sizing
      const textMetrics = ctx.measureText(label);
      const labelWidth = textMetrics.width + 16;
      const labelHeight = 24;

      // Position label to avoid overlap with points
      const labelY = y - 50;

      // Draw label background with better contrast
      ctx.fillStyle = '#000000cc';
      ctx.strokeStyle = '#ffffff40';
      ctx.lineWidth = 1;
      ctx.fillRect(x - labelWidth / 2, labelY - 12, labelWidth, labelHeight);
      ctx.strokeRect(x - labelWidth / 2, labelY - 12, labelWidth, labelHeight);

      // Draw label text with shadow for better readability
      ctx.fillStyle = '#000000';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.strokeText(label, x, labelY);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(label, x, labelY);
    });
  };

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg border border-white/20 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
      <div className="absolute top-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg text-sm font-semibold backdrop-blur-sm border border-white/20">
        Route optimized using {algorithm.toUpperCase()} algorithm
      </div>
      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg text-xs backdrop-blur-sm border border-white/20">
        {path.length} stops • Interactive visualization
      </div>
    </div>
  );
};

export default RouteVisualization;
