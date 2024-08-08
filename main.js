// // fetchData().then((data) => console.log(data));

// setTimeout(() => {
//   console.log('async');
// });
// async function tes() {
//   const result = await tes3();
//   console.log(result);
//   const aa = fetchData();
//   console.log('aa');
//   console.log(aa);
//   return 'ea';
// }
// async function tes2() {
//   console.log('tes2');

//   const result = await tes();
//   console.log(result);
//   console.log('stelah tes 2');
// }
// async function tes3() {
//   console.log('tes3');
//   for (let i = 0; i < 10; i++) {
//     console.log(i);
//   }
//   return 'tes3 akhir';
// }
// console.log('awal');
// tes2();
// console.log('akhir');

// function fetchData() {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       console.log('fetch Data');
//       resolve('Data fetched');
//     }, 0);
//   });
// }

let tes = 10.01;
const aaa = 2;
const coba = Number(aaa.toFixed(2));
tes += aaa;
console.log(coba);
console.log(tes);
