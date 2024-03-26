import { ApiManager } from "./ApiManager";

export const findAllImage = async () => {
  try {
    const result = ApiManager("", {
      method: "GET",
    });

    return result;
  } catch (error) {
    console.log(error);
  }
};
