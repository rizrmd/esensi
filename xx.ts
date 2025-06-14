type xx = {
  b: string;
  c: number;
}

const a = {
  a: "test",
  b: "example",
  c: 42,
  d: true,
  e: [1, 2, 3],
}

const b: xx = { ...a };
console.log(b);