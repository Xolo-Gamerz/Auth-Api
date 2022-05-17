declare global{
    namespace NodeJS{
        interface ProcessEnv{
            PORT: string
            TOKEN: string
            JWT_TOKEN:string
            MAIL_PORT:string
            ADRESS:string
            HOST:string
            USER:string
            PASSWORD:string
            SERVICE:string
        }
    }
}
export{}