import axios from "./request";

export async function visit(
  username: string
): Promise<{ access_token: string; token_type: string; encrypt_salt: string }> {
  return (await axios.postForm("/auth/visit", { username })).data;
}

export async function login(username: string, password: string): Promise<any> {
  return (await axios.postForm("/auth/login", { username, password })).data;
}

export async function getUser(): Promise<any> {
  return (await axios.get("/user/me")).data;
}

export async function logout(): Promise<void> {
  await axios.post("/auth/logout");
}
