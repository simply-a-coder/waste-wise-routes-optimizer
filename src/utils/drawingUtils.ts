
export const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
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

export const drawConnections = (ctx: CanvasRenderingContext2D, points: any[], bounds: any, scale: number, offsetX: number, offsetY: number) => {
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

export const drawPoints = (ctx: CanvasRenderingContext2D, points: any[], bounds: any, scale: number, offsetX: number, offsetY: number) => {
  points.forEach((point, index) => {
    const x = point.adjustedX || (offsetX + (point.lng - bounds.minLng) * scale);
    const y = point.adjustedY || (offsetY + (bounds.maxLat - point.lat) * scale);

    // Determine point style
    let color = '#3b82f6';
    let size = 12;
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
