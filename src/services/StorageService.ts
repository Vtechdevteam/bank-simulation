import { ADMIN_AUTH_CODE, USER_AUTH_CODE } from "../../AppConstatnt";
import store from 'store'

const StorageService = {
    setToken: (token: string) => {
        store.set("authToken", token)
    },
    getToken: (): string => {
        return store.get("authToken")
    },
    getUser: (): string => {
        if(StorageService.getToken() == ADMIN_AUTH_CODE){
            return "ADMIN"
        }else if (StorageService.getToken() == USER_AUTH_CODE){
            return "USER"
        }
        else{
            return ""
        }
    },
    login: (token: string) => {
        if(token == ADMIN_AUTH_CODE){
            StorageService.setToken(token)
        }else if (token == USER_AUTH_CODE){
            StorageService.setToken(token)
        }
        else{
            throw "Invalid credentials."
        }
    },
    logout: () => {
        store.clearAll()
    }
}

export default StorageService;