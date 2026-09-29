import type { ReactNode } from 'react';
import { RotateCcw, Sun, Thermometer } from 'lucide-react';
import { GlassCard } from '@/components/common/GlassCard';
import {
  LIGHT_INTENSITY_DEFAULT,
  LIGHT_INTENSITY_MAX,
  LIGHT_INTENSITY_MIN,
  WATER_TEMPERATURE_DEFAULT,
  WATER_TEMPERATURE_MAX,
  WATER_TEMPERATURE_MIN,
  useEcosystemStore,
} from '@/store/useEcosystemStore';

interface EnvironmentSliderProps {
  icon: ReactNode;
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  accentColor: string;
  trackGradient: string;
  onChange: (value: number) => void;
}

function EnvironmentSlider({
  icon,
  label,
  value,
  min,
  max,
  unit,
  accentColor,
  trackGradient,
  onChange,
}: EnvironmentSliderProps) {
  const progress = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex items-center gap-3">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${accentColor}25`, color: accentColor }}
      >
        {icon}
      </div>

      <div className="flex-1 min-w-40">
        <div className="flex justify-between items-center mb-1">
          <span className="text-white/70 text-xs">{label}</span>
          <span className="text-white text-xs font-mono font-bold">
            {value.toFixed(0)}
            {unit}
          </span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="environment-slider w-full h-1.5 rounded-full cursor-pointer"
          style={{
            color: accentColor,
            background: `linear-gradient(to right, ${trackGradient} ${progress}%, rgba(255, 255, 255, 0.12) ${progress}%)`,
          }}
          aria-label={label}
        />
      </div>
    </div>
  );
}

export function EnvironmentPanel() {
  const waterTemperature = useEcosystemStore((s) => s.waterTemperature);
  const lightIntensity = useEcosystemStore((s) => s.lightIntensity);
  const setWaterTemperature = useEcosystemStore((s) => s.setWaterTemperature);
  const setLightIntensity = useEcosystemStore((s) => s.setLightIntensity);
  const resetEnvironment = useEcosystemStore((s) => s.resetEnvironment);
  const isAtDefault =
    waterTemperature === WATER_TEMPERATURE_DEFAULT &&
    lightIntensity === LIGHT_INTENSITY_DEFAULT;

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30">
      <GlassCard className="px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="pr-4 border-r border-white/15">
            <div className="text-white font-bold text-sm whitespace-nowrap">环境对照</div>
            <div className="text-white/45 text-[10px] whitespace-nowrap">调节参数不移动物种</div>
          </div>

          <EnvironmentSlider
            icon={<Thermometer size={16} />}
            label="水温"
            value={waterTemperature}
            min={WATER_TEMPERATURE_MIN}
            max={WATER_TEMPERATURE_MAX}
            unit="°C"
            accentColor="#38bdf8"
            trackGradient="rgb(125 211 252), rgb(14 165 233)"
            onChange={setWaterTemperature}
          />

          <EnvironmentSlider
            icon={<Sun size={16} />}
            label="光照强度"
            value={lightIntensity}
            min={LIGHT_INTENSITY_MIN}
            max={LIGHT_INTENSITY_MAX}
            unit="%"
            accentColor="#fbbf24"
            trackGradient="rgb(254 240 138), rgb(251 191 36)"
            onChange={setLightIntensity}
          />

          <button
            onClick={resetEnvironment}
            disabled={isAtDefault}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-default text-white flex items-center justify-center transition-colors shrink-0"
            title="恢复默认环境"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
