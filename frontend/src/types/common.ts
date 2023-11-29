export type FormData = {
  [key: string]: {
    value: string;
    validator: (value: string) => boolean;
    unformatter: (value: string) => string;
    valid: boolean;
  };
};

export type UserType = { [key: string]: { email: string; number: string } };
export type UsersType = Array<UserType>;
