export const getBodyMassIndex = ({ weight, height }: { weight: number, height: number }): string => {
    const currentBodyMassIndex: number = weight / (Math.pow(height, 2));
    return `${currentBodyMassIndex.toFixed(2)} kg/m²`;
}

export const calculateMHR = ({ age }: { age: number }): string => {
    const MHR: number = 220 - age;
    return `${MHR.toFixed(2)} bpm`;
}

export const calculateBMRMen = ({ weight, height, age }: { weight: number, height: number, age: number }): string => {
    const BMR: number = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    return `${BMR.toFixed(2)} kcal/day`;
}

export const calculateBMRWomen = ({ weight, height, age }: { weight: number, height: number, age: number }): string => {
    const BMR: number = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    return `${BMR.toFixed(2)} kcal/day`;
}

export const calculateDosage = ({ weight, dosagePerKg }: { weight: number, dosagePerKg: number }): string => {
    const dosage: number = weight * dosagePerKg;
    return `${dosage.toFixed(2)} mg`;
}

export const calculateMVR = ({ tidalVolume, respiratoryRate }: { tidalVolume: number, respiratoryRate: number }): string => {
    const MVR: number = tidalVolume * respiratoryRate;
    return `${MVR.toFixed(2)} L/min`;
}

export const calculateGFR = ({ age, weight, serumCreatinine }: { age: number, weight: number, serumCreatinine: number }): string => {
    const GFR: number = ((140 - age) * weight) / (72 * serumCreatinine);
    return `${GFR.toFixed(2)} mL/min/1.73m²`;
}
