import { ApiManager } from "./ApiManager";

export const createDeposit = async (token, data) => {
  try {
    const result = ApiManager(`/deposit`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: data,
    });

    return result;
  } catch (error) {
    console.log(error);
  }
};

export const findAllDeposit = async (token) => {
  try {
    const result = ApiManager(`/deposit`, {
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

export const findDepositProdukType = async (token) => {
  try {
    const result = ApiManager(`/deposit/product-type`, {
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

export const findDepositById = async (token, id) => {
  try {
    const result = ApiManager(`/deposit/${id}`, {
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
