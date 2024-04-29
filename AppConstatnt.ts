let endpoint = "https://budget-genius.azurewebsites.net"
if (typeof window !== "undefined") {
    switch ((window as any).location.hostname) {
        case "ambitious-sea-091146800.4.azurestaticapps.net": {
            endpoint = "https://survey-portal-be-dev-spring-app-20231019155301.azuremicroservices.io";
            break;
        }
        case "localhost": {
            endpoint = "https://budget-genius.azurewebsites.net";
            break;
        }
        default: {
            endpoint = "https://budget-genius.azurewebsites.net";
        }
    }
}
export const BASE_ENDPOINT = endpoint

export const GLOBAL_DATA = 'https://budget-genius.azurewebsites.net/master-data'
export const ADD_GLOBAL_DATA = ''
export const UPDATE_GLOBAL_DATA = ''
export const ADMIN_AUTH_CODE = '199881'
export const USER_AUTH_CODE = '108090'







