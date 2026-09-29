/**
 * 环境参数（水温、光照强度）的取值范围、默认值与对模拟的影响系数。
 * 用于温度 / 光照对比实验：调节环境条件而不重新布置物种。
 */

export interface EnvironmentState {
  /** 水温，单位 °C，范围 10 ~ 35 */
  waterTemperature: number;
  /** 光照强度，单位 %（以缸内光源 60% 为默认），范围 0 ~ 100 */
  lightIntensity: number;
}

export const WATER_TEMP_MIN = 10;
export const WATER_TEMP_MAX = 35;
export const WATER_TEMP_DEFAULT = 25;

export const LIGHT_INTENSITY_MIN = 0;
export const LIGHT_INTENSITY_MAX = 100;
export const LIGHT_INTENSITY_DEFAULT = 60;

export const DEFAULT_ENVIRONMENT: EnvironmentState = {
  waterTemperature: WATER_TEMP_DEFAULT,
  lightIntensity: LIGHT_INTENSITY_DEFAULT,
};

export function clampEnvironment(partial: Partial<EnvironmentState>): Partial<EnvironmentState> {
  const result: Partial<EnvironmentState> = {};
  if (partial.waterTemperature !== undefined) {
    result.waterTemperature = Math.max(
      WATER_TEMP_MIN,
      Math.min(WATER_TEMP_MAX, partial.waterTemperature),
    );
  }
  if (partial.lightIntensity !== undefined) {
    result.lightIntensity = Math.max(
      LIGHT_INTENSITY_MIN,
      Math.min(LIGHT_INTENSITY_MAX, partial.lightIntensity),
    );
  }
  return result;
}

/**
 * 温度对代谢（能量消耗）的影响系数，采用 Q10 经验关系：
 * 偏离最适温度 25°C 时，每 10°C 代谢速率变化一倍。
 * 25°C 时为 1；低温代谢减缓、耗能降低；高温代谢加快、耗能升高。
 */
export function getMetabolismFactor(waterTemperature: number): number {
  return Math.pow(2, (waterTemperature - WATER_TEMP_DEFAULT) / 10);
}

/**
 * 光照对生产者光合作用（产能）的影响系数。
 * 60% 光照时为 1，光照越强光合产能越高；黑暗时为 0，生产者无法产能。
 */
export function getPhotosynthesisFactor(lightIntensity: number): number {
  return lightIntensity / LIGHT_INTENSITY_DEFAULT;
}
