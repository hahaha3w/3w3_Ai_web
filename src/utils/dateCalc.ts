
export function dateCalc(_dateTime: string): string {
  const inputDate = new Date(_dateTime);
  const now = new Date();
  const diffInMs = now.getTime() - inputDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays < 1) {
    // 如果是今天，显示具体时间
    const hours = inputDate.getHours().toString().padStart(2, "0");
    const minutes = inputDate.getMinutes().toString().padStart(2, "0");
    return `今天 ${hours}:${minutes}`;
  } else if (diffInDays <= 6) {
    // 如果是 1-6 天前，显示几天前
    return `${diffInDays}天前`;
  } else if (diffInDays <= 7) {
    // 如果是 7 天前，显示一周前
    return `一周前`;
  } else {
    // 超过 7 天，显示具体日期
    const year = inputDate.getFullYear();
    const month = (inputDate.getMonth() + 1).toString().padStart(2, "0");
    const day = inputDate.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
}