const getUrlEndpoint = (url:string) : string =>{
    return url.split('/').pop() as string;
}   
export default getUrlEndpoint