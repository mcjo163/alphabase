type Converted<T> = T extends string ? number : T extends number ? string : never;

const ascii = <T extends string | number>(val: T) => (
  typeof val === "string"
    ? val.charCodeAt(0)
    : String.fromCharCode(val)
) as Converted<T>;

function fromAlphabase(alpha: string): number {
  let val = 0, p = 1;

  for (const digit of alpha.split('').reverse()) {
    const digitVal = ascii(digit) - ascii('A') + 1;
    val += p * digitVal;
    p *= 26;
  }

  return val;
}

function toAlphabase(num: number): string {
  const ps: number[] = [];
  for (let p = 1; p === 1 || p < num; p *= 26) ps.push(p);
  return ps
    .toReversed()
    .map((p, k) => {
      const repr = ~~((num - ps.slice(0, -1-k).reduce((s, v) => s + v, 0)) / p);
      num -= repr * p;
      return ascii(ascii('A') + repr - 1);
    })
    .join('');
}

const out = Bun.file("output.txt").writer();
const writeln = (ln: any) => out.write(`${ln}\n`);

for (let i = 1; i <= 13520; i++) {
  let alpha = toAlphabase(i);
  let num = fromAlphabase(alpha);

  if (i !== num) {
    console.log(`broken for ${i}- alpha: ${alpha}, num: ${num}`);
    break;
  }

  writeln(alpha);
}

out.end();
