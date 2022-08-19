
export const getEnvVariables = () => {
    
    //import.meta.env;

    return {
        //...import.meta.env
        VITE_API_URL: import.meta.env.VITE_API_URL,
        VITE_MAPS_TOKEN: import.meta.env.VITE_MAPS_TOKEN,
    }

}