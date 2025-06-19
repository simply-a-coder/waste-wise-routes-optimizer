
export const adjustOverlappingPoints = (points: any[], bounds: any, scale: number, offsetX: number, offsetY: number) => {
  const adjustedPoints = points.map((point, index) => ({
    ...point,
    originalIndex: index,
    adjustedX: offsetX + (point.lng - bounds.minLng) * scale,
    adjustedY: offsetY + (bounds.maxLat - point.lat) * scale
  }));

  const minDistance = 35;
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

export const drawLabels = (ctx: CanvasRenderingContext2D, points: any[], bounds: any, scale: number, offsetX: number, offsetY: number) => {
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
