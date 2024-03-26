import { ApiManager } from "./ApiManager"

export const findAllImage = async (token) => {
    try {
        const result = ApiManager(`/image`,{
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