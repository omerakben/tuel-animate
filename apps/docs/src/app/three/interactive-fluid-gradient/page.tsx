import { InteractiveFluidGradient } from '@tuel/three';

export default function InteractiveFluidGradientPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <InteractiveFluidGradient
        brushSize={25.0}
        brushStrength={0.5}
        distortionAmount={2.5}
        fluidDecay={0.98}
        trailLength={0.8}
        stopDecay={0.85}
        color1="#b8fff7"
        color2="#6e3466"
        color3="#0133ff"
        color4="#66d1fe"
        colorIntensity={1.0}
        softness={1.0}
      />

      {/* Content overlay */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <nav className="flex justify-between items-center p-8 text-white">
          <div>
            <p className="text-xl font-bold">Orbit Studio</p>
          </div>
          <div className="flex gap-8">
            <p>Index</p>
            <p>Portfolio</p>
            <p>Info</p>
            <p>Contact</p>
          </div>
        </nav>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto mb-4 bg-white/10 backdrop-blur rounded-lg flex items-center justify-center">
                <div className="text-4xl">⚛️</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center p-8 text-white text-sm">
          <p>Experiment 0469</p>
          <p>Built by Codegrid</p>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-20 bg-black/20 backdrop-blur-sm rounded-lg p-4 text-white text-sm">
        <h3 className="font-bold mb-2">Interactive Fluid Gradient</h3>
        <p className="mb-2">Move your mouse to interact with the fluid simulation</p>
        <ul className="text-xs space-y-1">
          <li>• Real-time WebGL fluid dynamics</li>
          <li>• Mouse velocity tracking</li>
          <li>• Customizable colors & parameters</li>
          <li>• Smooth gradient transitions</li>
        </ul>
      </div>
    </div>
  );
}
