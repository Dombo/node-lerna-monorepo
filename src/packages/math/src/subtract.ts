export const subtract = (...numbers: number[]) => {
  let initialValue = numbers.pop();
  numbers.forEach(num => (initialValue = initialValue - num));
  return initialValue;
};
