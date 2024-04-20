
import axios, { AxiosRequestConfig } from 'axios';




/**
 * Wrapper function to make api calls through axios.
 * @param options AxiosRequestConfig
 * @returns Promise
 */
class NetworkService {
    
    //private ErrorToast: React.RefObject<Toast>;

    /**
     * Callback function for success
     * @param response API response
     * @returns API data
     */
    private onSuccess(response: any) {
        return response.data;
    }

    /**
     *
     * @param error API error
     * @returns Rejection promise
     */
    private onError(error: any) {

       
        return Promise.reject(error.response || error.message);
    }

    async makeRequest(options: AxiosRequestConfig) {
        
        return axios({
            baseURL: `${options.baseURL}`,
            headers: {
                // "Access-Control-Allow-Origin": "*",
                // "Access-Control-Allow-Headers" : "Content-Type",
                // "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                Accept: 'application/json',
                //Authorization: `Bearer ${token}`,
                ...options.headers
            },
            params: options.params,
            method: options.method,
            data: options.data
        })
            .then(this.onSuccess)
            .catch(this.onError)

    }

}
export default NetworkService