import { post } from "./fetch";
export const login = (username, password) => {
  return post("//login", {
    user: { username, password },
  });
};
export const createAccount = (username, password) => {
  console.log(username, password);
  return post("/register", {
    user: { username, password },
  });
};
