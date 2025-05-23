export default function GetMobile() {
  const userAgent = typeof globalThis.navigator === "undefined" ? "" : navigator.userAgent;
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  
  if (!userAgent) return false;
  return mobileRegex.test(userAgent);
}