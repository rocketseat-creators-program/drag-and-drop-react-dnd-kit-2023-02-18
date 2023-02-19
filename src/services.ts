export function save(data: any) {
  localStorage.setItem("data", JSON.stringify(data));
}

export function get() {
  const data = localStorage.getItem("data");

  if (data) {
    return JSON.parse(data);
  }

  return null;
}
