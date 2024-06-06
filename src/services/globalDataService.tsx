import NetworkService from "./NetworkService"
import { ADD_GLOBAL_DATA, BASE_ENDPOINT, GLOBAL_DATA, SUBMIT_RESPONSE } from "../../AppConstatnt"

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
    async submitResponse (body: any){
        const response = await new NetworkService().makeRequest({
            baseURL: `${SUBMIT_RESPONSE}`,
            method: 'post',
            data:body
        })
        return (response?.data)
    },
    async downloadReport (){
        const response = await new NetworkService().makeRequest({
            baseURL: `${SUBMIT_RESPONSE}`,
            method: 'get'
        })
        return (response?.data)
    },
    async getIp(){
        const response = await new NetworkService().makeRequest({
            baseURL: `https://api.ipify.org`,
            method: 'get'
        })
        return (response)
    }
}