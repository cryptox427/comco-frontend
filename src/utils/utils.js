export const decimalHandle = (val, decimal) => {
    try {
      // const decimal = val.countDecimals();
      return Math.ceil(val * Math.pow(10, decimal)) / Math.pow(10, decimal)
    } catch (e) {
      return val
    }

  } 