interface SplashScreenProps {
  onStart: () => void
}

export default function SplashScreen({ onStart }: SplashScreenProps) {
  return (
    <div className="relative w-full h-screen bg-black flex flex-col items-center justify-center font-mono">
      <div className="scanline" />
      <button 
        onClick={onStart}
        className="
          px-3 py-1 bg-transparent 
          border border-green-500 text-green-500 
          font-mono text-xl md:text-3xl 
          hover:bg-green-500 hover:text-black 
          active:bg-green-600
          transition-all duration-300
        "
      >
        [versteckis.ch]
      </button>
    </div>
  )
} 