import * as joi from 'joi';
import 'dotenv/config'

interface EnvSchema {
    PORT: number;
    DB_PASSWORD: string;
    DB_NAME: string;
    DB_HOST: string;
    DB_PORT: number;
    DB_USERNAME: string;
    JWT_SECRET: string;
}

const envSchema = joi.object({
    PORT: joi.number().required(),
    DB_PASSWORD: joi.string().required(),
    DB_NAME: joi.string().required(),
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().required(),
    DB_USERNAME: joi.string().required(),
    JWT_SECRET: joi.string().required(),
})
    .unknown(true)


const { error, value } = envSchema.validate(process.env)

if (error) {
    throw new Error(`El servidor amef no puede ser levantado`)
}

const env: EnvSchema = value;

export const envs = {
    PORT: env.PORT,
    DB_PASSWORD: env.DB_PASSWORD,
    DB_NAME: env.DB_NAME,
    DB_HOST: env.DB_HOST,
    DB_PORT: env.DB_PORT,
    DB_USERNAME: env.DB_USERNAME,
    JWT_SECRET: env.JWT_SECRET,
}