import { ApiManager } from "./ApiManager";

export const userLogin = async (data) => {
  try {
    const result = await ApiManager("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const userRegister = async (data) => {
  try {
    const result = await ApiManager("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      data: data,
    });

    return result;
  } catch (error) {
    console.log(error);
  }
};

export const ChangePassword = async (token, data) => {
  try {
    const result = await ApiManager("/change-password", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const findAllUser = async (token) => {
  try {
    const result = ApiManager("/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return result;
  } catch (error) {
    console.log(error);
  }
};
