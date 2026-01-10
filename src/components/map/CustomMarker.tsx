import TargetIcon from "@/assets/mapmarker/markerIcon.svg?react"

interface CustomMarkerProps {
  roomId: number;
  title: string;
  current: number;
  max: number;
}

const CustomMarker = ({ roomId, title, current, max }: CustomMarkerProps) => {
  return (
    <div data-room-id={roomId} className="flex flex-col items-center justify-center cursor-pointer group hover:scale-105 transition-transform">
      <div className="bg-main-dark2 border border-main-variant px-5 py-2.5 shadow-lg">
        <span className="text-main font-semibold text-[14px] whitespace-nowrap">
          {title} ({current}/{max})
        </span>
      </div>
      <div className="w-px h-2.5 bg-main-variant"></div>
      <div className="relative w-4 h-4 flex items-center justify-center">
        <TargetIcon />
      </div>
    </div>
  );
};

export default CustomMarker;