async function foo() {
  const p1 = new Promise((resolve) => setTimeout(() => resolve('1'), 1000));
  const p2 = new Promise((_, reject) => setTimeout(() => reject('2'), 1500));
  const results = [await p1, await p2];
}
foo().catch((err) => {
  console.log(err);
});
