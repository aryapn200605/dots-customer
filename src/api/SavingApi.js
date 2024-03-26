import { ApiManager } from "./ApiManager";

export const createSaving = async (token, data) => {
  try {
    const result = ApiManager(`/saving`, {
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
export const createSavingDeposit = async (token, data) => {
  try {
    const result = ApiManager(`saving/deposit`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      data: data,
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};
export const findAllSaving = async (token) => {
  try {
    const result = ApiManager(`/saving`, {
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

export const findSavingById = async (token, id) => {
  try {
    const result = ApiManager(`/saving/${id}`, {
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
export const findSavingProdukType = async (token) => {
  try {
    const result = ApiManager(`/saving/product-type`, {
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

export const findSavingHistory = async (token, id) => {
  try {
    const result = ApiManager(`saving/history/${id}`, {
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
