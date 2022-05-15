declare global{
    namespace NodeJS{
        interface ProcessEnv{
            PORT: string
            TOKEN: string
            JWT_TOKEN:string
        }
    }
}
export{}