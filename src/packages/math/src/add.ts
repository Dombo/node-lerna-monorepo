import { and, or, not } from '@dombo/logos';

export const add = (...numbers: number[]) => {
  and();
  or();
  not();
  return numbers.reduce((prevValue, currValue) => {
    return prevValue + currValue;
  }, 0);
};
