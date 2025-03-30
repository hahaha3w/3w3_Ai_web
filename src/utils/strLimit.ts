export const strLimit = (str?: string, limit: number = 10): string => {
  if (!str) {
    return "";
  }
  if (str.length > limit) {
    return str.slice(0, limit) + "...";
  }
  return str;
}

export const emptyOrItem = (str?: string): string | null => {
  if (!str || str === "") {
    return null;
  }
  return str;
}