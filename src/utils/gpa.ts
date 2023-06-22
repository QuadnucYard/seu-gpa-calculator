import _ from "lodash-es";

const gradeMap = new Map([
  ["优", 95],
  ["良", 85],
  ["中", 75],
  ["及格", 65],
]);

type Grade48 = {
  score: number;
  point: number;
  grade: string;
  color: string;
};

const lev48: Grade48[] = [
  { score: 96, point: 4.8, grade: "A+", color: "purple" },
  { score: 93, point: 4.5, grade: "A" , color: "deep-purple"},
  { score: 90, point: 4.0, grade: "A-", color: "indigo" },
  { score: 86, point: 3.8, grade: "B+", color: "blue" },
  { score: 83, point: 3.5, grade: "B" , color: "light-blue"},
  { score: 80, point: 3.0, grade: "B-", color: "cyan" },
  { score: 76, point: 2.8, grade: "C+", color: "teal" },
  { score: 73, point: 2.5, grade: "C" , color: "green"},
  { score: 70, point: 2.0, grade: "C-", color: "light-green" },
  { score: 66, point: 1.8, grade: "D+", color: "orange" },
  { score: 63, point: 1.5, grade: "D" , color: "amber"},
  { score: 60, point: 1.0, grade: "D-", color: "yellow" },
  { score: 0, point: 0.0, grade: "F" , color: "grey"},
];

type Grade40 = {
  score: number;
  point: number;
  color: string;
};
const lev40: Grade40[] = [
  { score: 85, point: 4.0, color: "negative" },
  { score: 75, point: 3.0, color: "warning" },
  { score: 60, point: 2.0, color: "positive" },
  { score: 0, point: 0.0, color: "dark" },
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

export function findGrade48(val: number) {
  for (const x of lev48) {
    if (val >= x.score) return x;
  }
  return lev48[0];
}

export function findGrade40(val: number) {
  for (const x of lev40) {
    if (val >= x.score) return x;
  }
  return lev40[0];
}

export function calcGP48(val: number): number {
  return findGrade48(val).point;
}

export function calcGP40(val: number): number {
  return findGrade40(val).point;
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
