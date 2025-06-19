
export const setupCanvas = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

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

  return { ctx, width: rect.width, height: rect.height };
};

export const calculateBounds = (points: any[]) => {
  const lats = points.map(p => p.lat || 0);
  const lngs = points.map(p => p.lng || 0);
  
  return {
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
    minLng: Math.min(...lngs),
    maxLng: Math.max(...lngs)
  };
};

export const calculateScale = (bounds: any, width: number, height: number) => {
  const latRange = bounds.maxLat - bounds.minLat || 0.01;
  const lngRange = bounds.maxLng - bounds.minLng || 0.01;
  
  return Math.min(width / lngRange, height / latRange) * 0.6;
};
