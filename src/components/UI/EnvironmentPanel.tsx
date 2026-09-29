import { GlassCard } from '@/components/common/GlassCard';
import { useEcosystemStore } from '@/store/useEcosystemStore';
import {
  WATER_TEMP_MIN,
  WATER_TEMP_MAX,
  WATER_TEMP_DEFAULT,
  LIGHT_INTENSITY_MIN,
  LIGHT_INTENSITY_MAX,
  LIGHT_INTENSITY_DEFAULT,
  getMetabolismFactor,
  getPhotosynthesisFactor,
} from '@/config/environment';
import { Thermometer, Sun, RotateCcw } from 'lucide-react';

export function EnvironmentPanel() {
  const waterTemperature = useEcosystemStore((s) => s.waterTemperature);
  const lightIntensity = useEcosystemStore((s) => s.lightIntensity);
  const setEnvironment = useEcosystemStore((s) => s.setEnvironment);
  const resetEnvironment = useEcosystemStore((s) => s.resetEnvironment);
  const isRunning = useEcosystemStore((s) => s.isRunning);

  const metabolismFactor = getMetabolismFactor(waterTemperature);
  const photosynthesisFactor = getPhotosynthesisFactor(lightIntensity);

  const isDefault =
    waterTemperature === WATER_TEMP_DEFAULT && lightIntensity === LIGHT_INTENSITY_DEFAULT;

  const getTempColor = (temp: number) => {
    if (temp <= 18) return '#38BDF8';
    if (temp >= 32) return '#FB923C';
    return '#22D3EE';
  };

  const getTempLabel = (temp: number) => {
    if (temp <= 18) return '低温 · 代谢减缓';
    if (temp >= 32) return '高温 · 代谢旺盛';
    return '适宜水温';
  };

  return (
    <div className="absolute top-20 right-4 z-20 w-64">
      <GlassCard className="p-4 hover:bg-white/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-bold text-base flex items-center gap-2">
            <span className="text-lg">🌡️</span> 环境条件
          </h3>
          <button
            onClick={resetEnvironment}
            disabled={isDefault}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-default disabled:hover:bg-transparent"
            title="恢复默认环境"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* 水温 */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-white/80 text-xs flex items-center gap-1.5">
              <Thermometer size={13} style={{ color: getTempColor(waterTemperature) }} />
              水温
            </label>
            <span
              className="text-sm font-mono font-bold"
              style={{ color: getTempColor(waterTemperature) }}
            >
              {waterTemperature.toFixed(0)}°C
            </span>
          </div>
          <input
            type="range"
            min={WATER_TEMP_MIN}
            max={WATER_TEMP_MAX}
            step={1}
            value={waterTemperature}
            onChange={(e) => setEnvironment({ waterTemperature: Number(e.target.value) })}
            className="env-slider w-full"
            style={{
              background: `linear-gradient(to right, #38bdf8 0%, #22d3ee ${
                ((waterTemperature - WATER_TEMP_MIN) / (WATER_TEMP_MAX - WATER_TEMP_MIN)) * 100
              }%, rgba(255,255,255,0.15) ${
                ((waterTemperature - WATER_TEMP_MIN) / (WATER_TEMP_MAX - WATER_TEMP_MIN)) * 100
              }%, rgba(255,255,255,0.15) 100%)`,
            }}
          />
          <div className="flex justify-between text-[10px] text-white/40 mt-0.5">
            <span>{WATER_TEMP_MIN}°C</span>
            <span style={{ color: getTempColor(waterTemperature) }}>
              {getTempLabel(waterTemperature)}
            </span>
            <span>{WATER_TEMP_MAX}°C</span>
          </div>
          <div className="mt-1 text-[10px] text-white/50">
            代谢耗能 ×{metabolismFactor.toFixed(2)}（默认 ×
            {getMetabolismFactor(WATER_TEMP_DEFAULT).toFixed(2)}）
          </div>
        </div>

        {/* 光照强度 */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-white/80 text-xs flex items-center gap-1.5">
              <Sun size={13} className="text-amber-300" />
              光照强度
            </label>
            <span className="text-sm font-mono font-bold text-amber-300">{lightIntensity}%</span>
          </div>
          <input
            type="range"
            min={LIGHT_INTENSITY_MIN}
            max={LIGHT_INTENSITY_MAX}
            step={1}
            value={lightIntensity}
            onChange={(e) => setEnvironment({ lightIntensity: Number(e.target.value) })}
            className="env-slider w-full"
            style={{
              background: `linear-gradient(to right, #fcd34d 0%, #fbbf24 ${lightIntensity}%, rgba(255,255,255,0.15) ${lightIntensity}%, rgba(255,255,255,0.15) 100%)`,
            }}
          />
          <div className="flex justify-between text-[10px] text-white/40 mt-0.5">
            <span>{LIGHT_INTENSITY_MIN}%</span>
            <span className="text-amber-200/70">
              {lightIntensity === 0 ? '黑暗 · 无法光合' : '生产者光合产能'}
            </span>
            <span>{LIGHT_INTENSITY_MAX}%</span>
          </div>
          <div className="mt-1 text-[10px] text-white/50">
            光合产能 ×{photosynthesisFactor.toFixed(2)}（默认 ×
            {getPhotosynthesisFactor(LIGHT_INTENSITY_DEFAULT).toFixed(2)}）
          </div>
        </div>

        {!isRunning && (
          <div className="mt-3 pt-2 border-t border-white/10 text-[10px] text-amber-200/70 leading-relaxed">
            ⏸ 模拟已暂停：调节参数只更新缸内视觉效果，不会推进模拟时间。
          </div>
        )}
      </GlassCard>
    </div>
  );
}
