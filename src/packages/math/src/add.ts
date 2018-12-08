export const add = (...numbers: number[]) => {
  return numbers.reduce((prevValue, currValue) => {
    return prevValue + currValue;
  }, 0);
};
