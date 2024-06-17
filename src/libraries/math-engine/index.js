import * as financial from "./financial";
import * as medicine from "./medicine";
import * as physics from "./physics";

export const mathematicalEnginedEncapsuled = {
  financial: {
    "Obtener ingresos totales": {
      value: "getTotalRevenue",
      requiredValues: {
        "Cantidad vendida": "quantitySold",
        "Precio por unidad": "salePrice",
      },
      method: financial.getTotalRevenue,
    },
    "Obtener consumo agregado": {
      value: "getAggregateConsumption",
      requiredValues: {
        "Ingreso disponible": "disposableIncome",
        "Propensión marginal al consumo": "marginalPropensityToConsume",
      },
      method: financial.getAggregateConsumption,
    },
    "Obtener ingresos anuales": {
      value: "getAnnualIncome",
      requiredValues: {
        "Ingreso mensual": "monthlyIncome",
      },
      method: financial.getAnnualIncome,
    },
    "Obtener producto interno bruto": {
      value: "getGrossDomesticProduct",
      requiredValues: {
        Consumo: "consumption",
        Inversión: "investment",
        "Gasto público": "publicSpending",
        Exportaciones: "exports",
        Importaciones: "imports",
      },
      method: financial.getGrossDomesticProduct,
    },
    "Tasa de inflación": {
      value: "getInflationRate",
      requiredValues: {
        "Índice de precios actual": "currentPriceIndex",
        "Índice de precios año anterior": "preciousPriceIndex",
      },
      method: financial.getInflationRate,
    },
    Porcentaje: {
      value: "getPercentage",
      requiredValues: {
        Cantidad: "quantity",
        Total: "total",
      },
      method: financial.getPercentage,
    },
    "Obtener costos totales": {
      value: "getTotalCosts",
      requiredValues: {
        "Costos fijos": "fixedCosts",
        "Costos variables": "variableCosts",
      },
      method: financial.getTotalCosts,
    },
  },
  medicine: {
    "Índice de Masa Corporal": {
      value: "getBodyMassIndex",
      requiredValues: {
        Peso: "weight",
        Altura: "height",
      },
      method: medicine.getBodyMassIndex,
    },
    "Frecuencia Cardíaca Máxima": {
      value: "calculateMHR",
      requiredValues: {
        Edad: "age",
      },
      method: medicine.calculateMHR,
    },
    "Tasa Metabólica Basal (Hombres)": {
      value: "calculateBMRMen",
      requiredValues: {
        Peso: "weight",
        Altura: "height",
        Edad: "age",
      },
      method: medicine.calculateBMRMen,
    },
    "Tasa Metabólica Basal (Mujeres)": {
      value: "calculateBMRWomen",
      requiredValues: {
        Peso: "weight",
        Altura: "height",
        Edad: "age",
      },
      method: medicine.calculateBMRWomen,
    },
    "Dosificación de Medicamentos": {
      value: "calculateDosage",
      requiredValues: {
        Peso: "weight",
        "Dosis por kg": "dosagePerKg",
      },
      method: medicine.calculateDosage,
    },
    "Volumen Minuto Respiratorio": {
      value: "calculateMVR",
      requiredValues: {
        "Volumen tidal": "tidalVolume",
        "Frecuencia respiratoria": "respiratoryRate",
      },
      method: medicine.calculateMVR,
    },
    "Filtración Glomerular": {
      value: "calculateGFR",
      requiredValues: {
        Edad: "age",
        Peso: "weight",
        "Creatinina sérica": "serumCreatinine",
      },
      method: medicine.calculateGFR,
    },
  },
  electronic: {
    "Voltaje": {
      value: "calculateVoltage",
      requiredValues: {
        "Corriente I": "I",
        "Resistencia R": "R",
      },
      method: physics.calculateVoltage,
    },
    "Corriente Eléctrica": {
      value: "calculateCurrent",
      requiredValues: {
        "Voltaje V": "V",
        "Resistencia R": "R",
      },
      method: physics.calculateCurrent,
    },
    "Resistencia": {
      value: "calculateResistence",
      requiredValues: {
        "Voltaje V": "V",
        "Corriente I": "I",
      },
      method: physics.calculateResistence,
    },
    "Potencia eléctrica": {
      value: "calculatePowerI2R",
      requiredValues: {
        "Voltaje V": "V",
        "Corriente I": "I",
      },
      method: physics.calculatePowerI2R,
    },
    "Fuerza de Coulomb": {
      value: "calculateCoulombForce",
      requiredValues: {
        "Carga eléctrica 1": "q1",
        "Carga eléctrica 2": "q2",
        "Distancia entre las cargas": "r"
      },
      method: physics.calculateCoulombForce,
    },
    "Energía eléctrica": {
      value: "calculateEnergy",
      requiredValues: {
        "Potencia": "P",
        "Tiempo": "t"
      },
      method: physics.calculateEnergy,
    },
    "Inducción Electromagnética": {
      value: "calculateInducedEMF",
      requiredValues: {
        "Variación flujo magnético Wb": "dPhi",
        "Tiempo en segundos": "dt"
      },
      method: physics.calculateEnergy,
    },
  },
  physics: {
    "Distancia recorrida": {
      value: "calculateUM",
      requiredValues: {
        "Valor v": "v",
        "Valor t": "t",
      },
      method: physics.calculateUM,
    },
    "Velocidad Promedio": {
      value: "calculateAV",
      requiredValues: {
        "Distancia d": "d",
        "Tiempo t": "t",
      },
      method: physics.calculateAV,
    },
    Aceleración: {
      value: "calculateAcceleration",
      requiredValues: {
        "Variación de velocidad deltaV": "deltaV",
        "Tiempo t": "t",
      },
      method: physics.calculateAcceleration,
    },
    "Movimiento Uniformemente Acelerado": {
      value: "calculateUAM",
      requiredValues: {
        "Posición inicial x0": "x0",
        "Velocidad inicial v0": "v0",
        "Aceleración a": "a",
        "Tiempo t": "t",
      },
      method: physics.calculateUAM,
    },
    "Fuerza (Segunda Ley de Newton)": {
      value: "calculateForce",
      requiredValues: {
        "Masa m": "m",
        "Aceleración a": "a",
      },
      method: physics.calculateForce,
    },
    "Energía Cinética": {
      value: "calculateKE",
      requiredValues: {
        "Masa m": "m",
        "Velocidad v": "v",
      },
      method: physics.calculateKE,
    },
    "Fuerza de Gravitación Universal": {
      value: "calculateGravityForce",
      requiredValues: {
        "Masa m1": "m1",
        "Masa m2": "m2",
        "Distancia r": "r",
        "Constante G": "G",
      },
      method: physics.calculateGravityForce,
    },
    "Voltaje": {
      value: "calculateVoltage",
      requiredValues: {
        "Corriente I": "I",
        "Resistencia R": "R",
      },
      method: physics.calculateVoltage,
    },
    "Velocidad desde Energía Cinética": {
      value: "calculateVelocityFromKE",
      requiredValues: {
        "Energía cinética KE": "KE",
        "Masa m": "m",
      },
      method: physics.calculateVelocityFromKE,
    },
    "Distancia desde Fuerza de Gravedad": {
      value: "calculateDistanceFromGravityForce",
      requiredValues: {
        "Masa m1": "m1",
        "Masa m2": "m2",
        "Fuerza F": "F",
        "Constante G": "G",
      },
      method: physics.calculateDistanceFromGravityForce,
    },
    "Corriente Eléctrica": {
      value: "calculateCurrent",
      requiredValues: {
        "Voltaje V": "V",
        "Resistencia R": "R",
      },
      method: physics.calculateCurrent,
    },
  },
};
