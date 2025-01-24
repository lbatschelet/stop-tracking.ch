export default function StaticLayout() {
  return (
    <div className="relative w-full h-screen bg-black flex flex-col items-center font-mono">
      <div className="absolute top-4 left-4 text-green-500 text-sm md:text-base z-20">
        <div className="cursor-blink">[SYSTEM_INITIALIZING...]</div>
      </div>
    </div>
  )
} 