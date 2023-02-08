export function createColorMap() {
  const colors = new Map<string, string>();

  return function get(key: string) {
    if (!colors.has(key)) {
      colors.set(key, createRandomColor());
    }

    return colors.get(key);
  };
}

function createRandomColor() {
  const hue = Math.floor(Math.random() * 360);

  return `hsl(${hue}deg 75% 75%)`;
}
