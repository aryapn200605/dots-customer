import { ApiManager } from "./ApiManager"

export const checkToken = async (token) => {
    try {
        const result = ApiManager(`/check-token`,{
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return result
    } catch (error) {
        console.log(error)
    }
}