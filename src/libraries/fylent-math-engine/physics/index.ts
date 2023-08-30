const k = 8.988e9;

export const calculateUM = ({ v, t }: { v: number, t: number }): string => `${(v * t).toFixed(2)} m/s`;

export const calculateAV = ({ d, t }: { d: number, t: number }): string => `${(d / t).toFixed(2)} m/s`;

export const calculateAcceleration = ({ deltaV, t }: { deltaV: number, t: number }): string => `${(deltaV / t).toFixed(2)} m/s²`;

export const calculateUAM = ({ x0, v0, a, t }: { x0: number, v0: number, a: number, t: number }): string =>
  `${(x0 + v0 * t + 0.5 * a * Math.pow(t, 2)).toFixed(2)} m`;

export const calculateForce = ({ m, a }: { m: number, a: number }): number => m * a;

export const calculateKE = ({ m, v }: { m: number, v: number }): string => `${(0.5 * m * Math.pow(v, 2)).toFixed(2)} J`;

export const calculateGravityForce = ({ m1, m2, r, G }: { m1: number, m2: number, r: number, G: number }): string =>
  `${((G * m1 * m2) / (Math.pow(r, 2))).toFixed(2)} N`;

export const calculateVoltage = ({ I, R }: { I: number, R: number }): string => (I * R).toString();

export const calculateVelocityFromKE = ({ KE, m }: { KE: number, m: number }): string =>
  `${(Math.sqrt((2 * KE) / m)).toFixed(2)} m/s`;

export const calculateDistanceFromGravityForce = ({ m1, m2, F, G }: { m1: number, m2: number, F: number, G: number }): string =>
  `${(Math.sqrt((G * m1 * m2) / F)).toFixed(2)} m`;

export const calculateCurrent = ({ V, R }: { V: number, R: number }): string =>
  `${(V / R).toFixed(2)} A`;

export const calculateResistence = ({ V, I }: { V: number, I: number }): string =>
  `${(V / I).toFixed(2)} Ohms`;

export const calculatePowerVI = ({ V, I }: { V: number, I: number }): string =>
  `${(V * I).toFixed(2)} Watts`;

export const calculatePowerI2R = ({ I, R }: { I: number, R: number }): string =>
  `${(I ** 2 * R).toFixed(2)} Watts`;

export const calculatePowerV2R = ({ V, R }: { V: number, R: number }): string =>
  `${(V ** 2 / R).toFixed(2)} Watts`;

export const calculateCoulombForce = ({ q1, q2, r }: { q1: number, q2: number, r: number }): string =>
  `${(k * q1 * q2 / r ** 2).toFixed(2)} Newtons`;

export const calculateEnergy = ({ P, t }: { P: number, t: number }): string =>
  `${(P * t).toFixed(2)} Joules`;

export const calculateInducedEMF = ({ dPhi, dt }: { dPhi: number, dt: number }): string =>
  `${(-dPhi / dt).toFixed(2)} Volts`;