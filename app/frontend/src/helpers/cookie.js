export const getCookie = (name) => {
  const match = document.cookie.match(
    new RegExp("(^| )" + name + "=([^;]+)")
  );
  if (match) {
    return decodeURIComponent(match[2]);
  }
  return null;
};
export function deleteCookie(cname) {
  document.cookie = `${cname}=; path=/; max-age=0;`;
}