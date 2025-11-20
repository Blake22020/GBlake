import 'dotenv/config'

const required = [
    'MONGO_URL',
    'CREATOR',
    'PORT',
    'JWT_EXPIRES_IN',
    'JWT_SECRET'
]

required.forEach((require) => {
    if(!process.env[require]) {
        console.error(`Missing env variable: ${require}`);
        process.exit(1);
    }
})

export const env = {
    mongoUrl: process.env.MONGO_URL as string,
    creator: process.env.CREATOR as string,
    port: process.env.PORT as string,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN as string,
    jwtSecret: process.env.JWT_SECRET as string,
}