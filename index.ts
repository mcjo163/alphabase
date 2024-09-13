type Converted<T> = T extends string ? number : T extends number ? string : never;

const ascii = <T extends string | number>(val: T) => (
  typeof val === "string"
    ? val.charCodeAt(0)
    : String.fromCharCode(val)
) as Converted<T>;

const CHAR_A = ascii('A');

function fromAlphabase(alpha: string): number {
  let val = 0, pow = 1;

  for (let d = alpha.length - 1; d >= 0; d--) {
    if (!/[A-Z]/.test(alpha.charAt(d))) return NaN;

    const digitVal = alpha.charCodeAt(d) - CHAR_A + 1;
    val += pow * digitVal;
    pow *= 26;
  }

  return val;
}

function toAlphabase(num: number): string {
  let len = 1, reserved = 1, pow = 1;
  while (pow * 26 <= num - reserved) {
    len += 1;
    pow *= 26;
    reserved += pow;
  }

  const digits = new Array<number>(len);
  for (let i = 0; i < len; i++) {
    reserved -= pow;
    const repr = ((num - reserved) / pow) | 0;
    num -= repr * pow;
    digits[i] = CHAR_A + repr - 1;
    pow /= 26;
  }

  return String.fromCharCode(...digits);
}

const alphabase = <T extends string | number>(val: T) => (
  typeof val === "string"
    ? fromAlphabase(val)
    : toAlphabase(val)
) as Converted<T>;

const out = Bun.file("output.txt").writer();
const writeln = (ln: any) => out.write(`${ln}\n`);

for (let i = 1; i <= 13520; i++) {
  let alpha = alphabase(i);
  let num = alphabase(alpha);

  if (i !== num) {
    console.log(`broke: ${i} -> ${alpha} -> ${num}`);
  }

  writeln(alpha);
}

out.end();
