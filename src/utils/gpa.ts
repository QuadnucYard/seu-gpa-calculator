import _ from "lodash-es";

const gradeMap = new Map([
  ["优", 95],
  ["良", 85],
  ["中", 75],
  ["及格", 65],
]);
const lev48: {
  score: number;
  point: number;
  grade: string;
}[] = [
  { score: 96, point: 4.8, grade: "A+" },
  { score: 93, point: 4.5, grade: "A" },
  { score: 90, point: 4.0, grade: "A-" },
  { score: 86, point: 3.8, grade: "B+" },
  { score: 83, point: 3.5, grade: "B" },
  { score: 80, point: 3.0, grade: "B-" },
  { score: 76, point: 2.8, grade: "C+" },
  { score: 73, point: 2.5, grade: "C" },
  { score: 70, point: 2.0, grade: "C-" },
  { score: 66, point: 1.8, grade: "D+" },
  { score: 63, point: 1.5, grade: "D" },
  { score: 60, point: 1.0, grade: "D-" },
  { score: 0, point: 0.0, grade: "F" },
];
const lev40: {
  score: number;
  point: number;
}[] = [
  { score: 85, point: 4.0 },
  { score: 75, point: 3.0 },
  { score: 60, point: 2.0 },
  { score: 0, point: 0.0 },
];

export function round2(x: number) {
  return Math.round(x * 100) / 100;
}
export function round3(x: number) {
  return Math.round(x * 1000) / 1000;
}
export function round4(x: number) {
  return Math.round(x * 10000) / 10000;
}

export function calcGP48(val: number): number {
  for (const x of lev48) {
    if (val >= x.score) return x.point;
  }
  return NaN;
}

export function calcGP40(val: number): number {
  for (const x of lev40) {
    if (val >= x.score) return x.point;
  }
  return NaN;
}

export function calcGPA(data: { XF: number; ZCJ: number }[]) {
  let reduced = data.map(cur => ({
    credit: Number(cur.XF),
    score: Number(cur.ZCJ),
    gp48: calcGP48(cur.ZCJ),
    gp40: calcGP40(cur.ZCJ),
  }));
  const sumCredit = round2(_.sumBy(reduced, "credit"));
  const sumGP48 = round3(_.sumBy(reduced, "gp48"));
  const sumGP40 = round3(_.sumBy(reduced, "gp40"));
  const GPA48 = round4(_.sumBy(reduced, t => t.credit * t.gp48) / sumCredit);
  const GPA40 = round4(_.sumBy(reduced, t => t.credit * t.gp40) / sumCredit);
  const avgScore = round2(_.sumBy(reduced, "score") / reduced.length);
  console.log(reduced, GPA48, GPA40, avgScore);
  return { sumCredit, sumGP48, GPA48, sumGP40, GPA40, avgScore };
}
