import NetworkService from "./NetworkService"
import { ADD_GLOBAL_DATA, BASE_ENDPOINT, GLOBAL_DATA } from "../../AppConstatnt"

export const GlobalDataService={
    
    async getGlobalDataData (){
        const response = await new NetworkService().makeRequest({
            baseURL: `${GLOBAL_DATA}`,
            method: 'get'
        })
        return (response?.data)
    },
    async addGlobalData (body:any){
        const response = await new NetworkService().makeRequest({
            baseURL: `${GLOBAL_DATA}`,
            method: 'post',
            data:body
        })
        return (response?.data)
    },
   
    

    

    
}