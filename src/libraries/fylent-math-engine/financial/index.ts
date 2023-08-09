export const getTotalRevenue = ({ quantitySold, salePrice }: { quantitySold: number, salePrice: number }): string => {
      const currentTotalRevenue: number = quantitySold * salePrice;
      return currentTotalRevenue.toFixed(2);
  }
  
  export const getTotalCosts = ({ fixedCosts, variableCosts }: { fixedCosts: number, variableCosts: number }): string => {
      const currentTotalCosts: number = fixedCosts * variableCosts;
      return currentTotalCosts.toFixed(2);
  }
  
  export const getGrossDomesticProduct = ({ consumption, investment, publicSpending, exports, imports }: { consumption: number, investment: number, publicSpending: number, exports: number, imports: number }): string => {
      const currentGrossDomesticProduct: number = (consumption + investment + publicSpending) + (exports - imports);
      return currentGrossDomesticProduct.toFixed(2);
  }
  
  export const getInflationRate = ({ currentPriceIndex, preciousPriceIndex }: { currentPriceIndex: number, preciousPriceIndex: number }): string => {
      const deltaPriceIndex: number = currentPriceIndex - preciousPriceIndex;
      const inflationRate = (deltaPriceIndex / preciousPriceIndex) * 100;
      return `${inflationRate.toFixed(2)}%`;
  }
  
  export const getAggregateConsumption = ({ disposableIncome, marginalPropensityToConsume }: { disposableIncome: number, marginalPropensityToConsume: number }): string => {
      const aggregateConsumption: number = disposableIncome * marginalPropensityToConsume;
      return aggregateConsumption.toFixed(2);
  }
  
  export const getAnnualIncome = ({ monthlyIncome }: { monthlyIncome: number }): string => {
      const annualIncome: number = monthlyIncome * 12;
      return annualIncome.toFixed(2);
  }
  
  export const getPercentage = ({ quantity, total }: { quantity: number, total: number }): string => {
      const currentPercentage: number = (quantity / total) * 100;
      return `${currentPercentage.toFixed(2)}%`;
  }