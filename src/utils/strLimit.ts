export const strLimit = (str: string, limit: number = 10): string => {
  if (str.length > limit) {
    return str.slice(0, limit) + "...";
  }
  return str;
}