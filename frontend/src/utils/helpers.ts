import { FormData } from "../types/common";

export const createInputValuesObject = (data: FormData) => {
  const values: { [key: string]: string } = {};

  Object.keys(data).forEach((key) => {
    values[key] = data[key].value;
  });

  return values;
};

export const unformatNumber = (value: string) => {
  const unformatted = value.replace(/\D/g, "");

  return unformatted;
};
