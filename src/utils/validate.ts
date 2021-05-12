// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const isValidFullName = (str: string): boolean => {
  return !str ? false : str.trim().length >= 3;
};

export const isValidEmail = (email: string): boolean => {
  // {xxx@xxx.xx}
  const reg = /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
  return reg.test(email);
};
