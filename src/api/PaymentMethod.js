import { ApiManager } from "./ApiManager";

export const FindPaymentMethod = async (token,type,norek) => {
  try {
    const result = ApiManager(`/payment-method/${type}/${norek}`, {
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
