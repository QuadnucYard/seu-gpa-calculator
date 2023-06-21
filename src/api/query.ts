import axios from "./request";

export async function query(): Promise<any> {
  return (await axios.get("/query")).data;
}
