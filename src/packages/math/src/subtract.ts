export const subtract = (...numbers: number[]) => {
  return numbers.reduce((prevValue, currValue) => {
    return prevValue ? prevValue - currValue : currValue;
  });
};
