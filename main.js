fetchData().then((data) => console.log(data));

setTimeout(() => {
  console.log('async');
});
async function tes() {
  const result = await tes3();
  console.log(result);
  console.log('aa');
  return 'ea';
}
async function tes2() {
  console.log('tes2');

  const result = tes();
  console.log(result);
  console.log('stelah tes 2');
}
async function tes3() {
  console.log('tes3');
  for (let i = 0; i < 10; i++) {
    console.log(i);
  }
  return 'tes3 akhir';
}
console.log('awal');
tes2();
console.log('akhir');

function fetchData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('fetch Data');
      resolve('Data fetched');
    }, 0);
  });
}
function ta() {
  return {
    ea: 'tes',
  };
}
const coba = { ta: ta() };
console.log(coba);
