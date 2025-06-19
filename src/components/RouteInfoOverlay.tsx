
interface RouteInfoOverlayProps {
  algorithm: string;
  stopCount: number;
}

const RouteInfoOverlay = ({ algorithm, stopCount }: RouteInfoOverlayProps) => {
  return (
    <>
      <div className="absolute top-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg text-sm font-semibold backdrop-blur-sm border border-white/20">
        Route optimized using {algorithm.toUpperCase()} algorithm
      </div>
      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg text-xs backdrop-blur-sm border border-white/20">
        {stopCount} stops • Interactive visualization
      </div>
    </>
  );
};

export default RouteInfoOverlay;
