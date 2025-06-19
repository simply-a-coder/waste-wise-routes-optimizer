
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
    const padding = 120; // Increased padding for labels
    const scale = calculateScale(bounds, rect.width - padding * 2, rect.height - padding * 2);
    const offsetX = padding;
    const offsetY = padding;

    // Adjust overlapping points before drawing
    const adjustedPoints = adjustOverlappingPoints(path, bounds, scale, offsetX, offsetY);

    // Draw route elements in order for better layering
    drawConnections(ctx, adjustedPoints, bounds, scale, offsetX, offsetY);
    drawPoints(ctx, adjustedPoints, bounds, scale, offsetX, offsetY);
    drawLabels(ctx, adjustedPoints, bounds, scale, offsetX, offsetY);

  }, [path, algorithm]);

  const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Create gradient background
    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2);
    gradient.addColorStop(0, '#1e3a8a');
    gradient.addColorStop(0.5, '#7c3aed');
    gradient.addColorStop(1, '#0891b2');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

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
    
    return Math.min(width / lngRange, height / latRange) * 0.6; // Reduced scale for more spacing
  };

  // New function to adjust overlapping points
  const adjustOverlappingPoints = (points: any[], bounds: any, scale: number, offsetX: number, offsetY: number) => {
    const adjustedPoints = points.map((point, index) => ({
      ...point,
      originalIndex: index,
      adjustedX: offsetX + (point.lng - bounds.minLng) * scale,
      adjustedY: offsetY + (bounds.maxLat - point.lat) * scale
    }));

    const minDistance = 35; // Minimum distance between points
    const maxIterations = 50;

    for (let iteration = 0; iteration < maxIterations; iteration++) {
      let hasOverlap = false;

      for (let i = 0; i < adjustedPoints.length; i++) {
        for (let j = i + 1; j < adjustedPoints.length; j++) {
          const point1 = adjustedPoints[i];
          const point2 = adjustedPoints[j];
          
          const dx = point1.adjustedX - point2.adjustedX;
          const dy = point1.adjustedY - point2.adjustedY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < minDistance) {
            hasOverlap = true;
            
            // Calculate repulsion force
            const angle = Math.atan2(dy, dx);
            const pushDistance = (minDistance - distance) / 2;
            
            point1.adjustedX += Math.cos(angle) * pushDistance;
            point1.adjustedY += Math.sin(angle) * pushDistance;
            point2.adjustedX -= Math.cos(angle) * pushDistance;
            point2.adjustedY -= Math.sin(angle) * pushDistance;
          }
        }
      }

      if (!hasOverlap) break;
    }

    return adjustedPoints;
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
      const x = point.adjustedX || (offsetX + (point.lng - bounds.minLng) * scale);
      const y = point.adjustedY || (offsetY + (bounds.maxLat - point.lat) * scale);

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
      
      const x1 = current.adjustedX || (offsetX + (current.lng - bounds.minLng) * scale);
      const y1 = current.adjustedY || (offsetY + (bounds.maxLat - current.lat) * scale);
      const x2 = next.adjustedX || (offsetX + (next.lng - bounds.minLng) * scale);
      const y2 = next.adjustedY || (offsetY + (bounds.maxLat - next.lat) * scale);

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
      const x = point.adjustedX || (offsetX + (point.lng - bounds.minLng) * scale);
      const y = point.adjustedY || (offsetY + (bounds.maxLat - point.lat) * scale);

      // Determine point style
      let color = '#3b82f6';
      let size = 12; // Increased size for better visibility
      let borderColor = '#ffffff';

      if (point.id === 'start') {
        color = '#10b981';
        size = 16;
        borderColor = '#ffffff';
      } else if (point.id === 'end') {
        color = '#ef4444';
        size = 16;
        borderColor = '#ffffff';
      } else if (point.fillLevel && point.fillLevel >= 90) {
        color = '#f59e0b';
        size = 14;
        borderColor = '#ffffff';
      }

      // Draw point shadow
      ctx.fillStyle = '#00000080';
      ctx.beginPath();
      ctx.arc(x + 2, y + 2, size, 0, 2 * Math.PI);
      ctx.fill();

      // Draw point with glow
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
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
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.strokeText((index + 1).toString(), x, y);
      ctx.fillText((index + 1).toString(), x, y);
    });
  };

  const drawLabels = (ctx: CanvasRenderingContext2D, points: any[], bounds: any, scale: number, offsetX: number, offsetY: number) => {
    ctx.font = '13px Arial';
    ctx.textAlign = 'center';

    // Calculate label positions to avoid overlaps
    const labelPositions: { x: number; y: number; width: number; height: number; text: string }[] = [];

    points.forEach((point, index) => {
      const x = point.adjustedX || (offsetX + (point.lng - bounds.minLng) * scale);
      const y = point.adjustedY || (offsetY + (bounds.maxLat - point.lat) * scale);

      // Truncate long location names
      let label = point.location || `Point ${index + 1}`;
      if (label.length > 18) {
        label = label.substring(0, 15) + '...';
      }

      // Measure text for background sizing
      const textMetrics = ctx.measureText(label);
      const labelWidth = textMetrics.width + 20;
      const labelHeight = 28;

      // Try different positions to avoid overlaps
      const positions = [
        { x: x, y: y - 60 }, // Top
        { x: x, y: y + 60 }, // Bottom
        { x: x - 80, y: y - 30 }, // Left
        { x: x + 80, y: y - 30 }, // Right
        { x: x - 60, y: y - 50 }, // Top-left
        { x: x + 60, y: y - 50 }, // Top-right
        { x: x - 60, y: y + 50 }, // Bottom-left
        { x: x + 60, y: y + 50 }  // Bottom-right
      ];

      let bestPosition = positions[0];
      let minOverlaps = Infinity;

      for (const pos of positions) {
        let overlaps = 0;
        const testRect = {
          x: pos.x - labelWidth / 2,
          y: pos.y - labelHeight / 2,
          width: labelWidth,
          height: labelHeight
        };

        // Check overlap with existing labels
        for (const existing of labelPositions) {
          if (testRect.x < existing.x + existing.width &&
              testRect.x + testRect.width > existing.x &&
              testRect.y < existing.y + existing.height &&
              testRect.y + testRect.height > existing.y) {
            overlaps++;
          }
        }

        if (overlaps < minOverlaps) {
          minOverlaps = overlaps;
          bestPosition = pos;
        }
      }

      labelPositions.push({
        x: bestPosition.x - labelWidth / 2,
        y: bestPosition.y - labelHeight / 2,
        width: labelWidth,
        height: labelHeight,
        text: label
      });

      // Draw label background with better contrast
      ctx.fillStyle = '#000000dd';
      ctx.strokeStyle = '#ffffff60';
      ctx.lineWidth = 1;
      ctx.fillRect(bestPosition.x - labelWidth / 2, bestPosition.y - labelHeight / 2, labelWidth, labelHeight);
      ctx.strokeRect(bestPosition.x - labelWidth / 2, bestPosition.y - labelHeight / 2, labelWidth, labelHeight);

      // Draw connecting line from point to label
      ctx.strokeStyle = '#ffffff80';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(bestPosition.x, bestPosition.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw label text with shadow for better readability
      ctx.fillStyle = '#000000';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.strokeText(label, bestPosition.x, bestPosition.y);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(label, bestPosition.x, bestPosition.y);
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
