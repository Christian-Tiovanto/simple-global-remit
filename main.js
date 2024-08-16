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

const yaml = require('js-yaml');
const fs = require('fs');

try {
  const data = yaml.load(fs.readFileSync('tes.yml', 'utf8'));
  console.log(data);
} catch (e) {
  console.error(e);
}

console.log(Math.ceil(0.000068965) / 100);
let num = 0.000000068965;

// Using Math.ceil() approach
function roundUpToTenDecimalPlaces(num) {
  return Math.ceil(num * 10000000000) / 10000000000;
}
console.log(roundUpToTenDecimalPlaces(num).toFixed(10));
console.log(Number(1 / 0.00045));
const obj = Object.create(null);
obj.tes = 'ea';
obj.id = '94';
obj.status = 'pending';

console.log(obj); // Output: [Object: null prototype] { tes: 'ea', id: '94', status: 'pending' }
function generateSerial(userId) {
  const currentTime = Date.now();
  const paddedUserId = userId.toString();
  const randomNumber = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');
  const serial = `${currentTime}${paddedUserId}${randomNumber}`;
  return serial;
}

// Example usage
const userId = 123;
const serial = generateSerial(userId);
console.log(serial);
const a = {
  length: 1,
  b: 2,
};
const [x, z, ...{ length }] = [1, 2, 4];
console.log(x, z, length);
const [o, b, ...{ length2 }] = [1, 2, 3];
console.log(o, b, length2); // 1 2 1
