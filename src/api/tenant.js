import { ApiManager } from "./ApiManager";

export const findTenantByid = async (id) => {
  try {
    const result = ApiManager(`/tenant/${id}`, {
      method: "GET",
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};
