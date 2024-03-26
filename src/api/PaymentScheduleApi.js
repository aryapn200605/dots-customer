import { ApiManager } from "./ApiManager";

export const findPaymentScheduleById = async (token, id) => {
  try {
    const result = ApiManager(``, {
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
