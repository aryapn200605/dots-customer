import { ApiManager } from "./ApiManager";

export const createLoan = async (token, data) => {
  try {
    const result = ApiManager(`/loan`, {
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

export const findLoanById = async (token, id) => {
  try {
    const result = ApiManager(`loan/${id}`, {
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
export const findLoanBillById = async (token, id) => {
  try {
    const result = ApiManager(`loan/bill/${id}`, {
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
export const findLoanNowlById = async (token, id) => {
  try {
    const result = ApiManager(`loan/now/${id}`, {
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
export const findLoanProdukType = async (token) => {
  try {
    const result = ApiManager(`/loan/product-type`, {
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
export const createLoanTopup = async (token, data) => {
  try {
    const result = await ApiManager(`/loan/topup`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: data,
    });
    return result.data;
  } catch (error) {
    console.error("Error creating loan top-up:", error);

    if (error.response) {
      console.error("Server Response Data:", error.response.data);
      console.error("Server Response Status:", error.response.status);
    }

    throw error;
  }
};

export const createPayment = async (token, data) => {
  try {
    const result = ApiManager(`/loan/repay`, {
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

export const createLoanRestructure = async (token, id, data) => {
  try {
    const result = ApiManager(``, {
      method: "PATCH",
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

export const findAllLoan = async (token) => {
  try {
    const result = ApiManager(`/loan`, {
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

export const findReasonList = async () => {
  try {
    const result = ApiManager(`/topup-reason`, {
      method: "GET",
    });

    return result;
  } catch (error) {
    console.log(error);
  }
};
