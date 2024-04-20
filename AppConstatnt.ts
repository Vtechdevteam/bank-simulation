let endpoint = "https://urmmarketplacebedev.azurewebsites.net"
if (typeof window !== "undefined") {
    switch ((window as any).location.hostname) {
        case "ambitious-sea-091146800.4.azurestaticapps.net": {
            endpoint = "https://survey-portal-be-dev-spring-app-20231019155301.azuremicroservices.io";
            break;
        }
        case "localhost": {
            endpoint = "http://192.168.29.246:8080";
            break;
        }
        default: {
            endpoint = "https://urmmarketplacebedev.azurewebsites.net";
        }
    }
}
export const BASE_ENDPOINT = endpoint

export const GLOBAL_DATA = 'http://192.168.29.246:8080/master-data'
export const ADD_GLOBAL_DATA = ''
export const UPDATE_GLOBAL_DATA = ''







