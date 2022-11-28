import { Module } from "@nestjs/common";
import { ConfigModule as Config } from "@nestjs/config";
import config from "./config";

const ENV = process.env.NODE_ENV;

@Module({
    imports: [
        Config.forRoot({
            envFilePath: !ENV ? 'environments/.env' : `environments/.env.${ENV}`,
            load: [config],
            isGlobal: true
        })
    ]
})
export class ConfigureModule {}