import { query } from "@/api/query";
import { findGrade48, findGrade40, round3 } from "@/utils/gpa";

const exclusion = ["TSYYDM", "JDF", "SFPJ"];

export async function formatTableDisplay() {
  const { model, data } = await query();
  const rows = data.map((r: any) => {
    const ZCJ = Number(r.ZCJ);
    const gp48 = findGrade48(ZCJ);
    const gp40 = findGrade40(ZCJ);
    return Object.assign(r, {
      ZCJ,
      XFJD48: gp48.point,
      JDF48: round3(gp48.point * r.XF),
      XFJD40: gp40.point,
      JDF40: gp40.point * r.XF,
      JD_color48: gp48.color,
      JD_color40: gp40.color,
    });
  });
  const cols = model
    .filter(
      (t: any) =>
        !t["form.hidden"] &&
        t.caption &&
        t.caption.length < 7 &&
        !t.name.startsWith("BY") &&
        !exclusion.includes(t.name)
    )
    .concat([
      { name: "XFJD48", caption: "(4.8)", required: true },
      { name: "JDF48", caption: "(4.8)*", required: false },
      { name: "XFJD40", caption: "(4.0)", required: true },
      { name: "JDF40", caption: "(4.0)*", required: false },
    ])
    .map((t: any) => ({
      name: t.name, // 用于索引
      label: t.caption, // 用于显示内容
      field: t.name.endsWith("DM") ? t.name + "_DISPLAY" : t.name, // 用于显示标题
      align: "center",
      sortable: true,
      required: t.required ?? false,
    }));
  const visibleCols = model
    .filter(
      (t: any) =>
        !t.hidden &&
        t.caption != "替代课程" &&
        t.caption != "替代课程号" &&
        t.name != "JDF48" &&
        t.name != "JDF40"
    )
    .map((t: any) => t.name);
  const selected = rows.filter(t => t.CXCKDM_DISPLAY == "首修");
  return { rows, cols, visibleCols, selected };
}
