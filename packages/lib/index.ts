export function calc(input: string): number {
  const [x, y] = input.split("+");
  return parseInt(x) + parseInt(y);
}
