import * as dotenv from 'dotenv';

dotenv.config()

export class ProfileValueService {


    USER_VALUE = process.env.PROFILE_USER_UUID;
    ADMIN_VALUE = process.env.PROFILE_ADMIN_UUID;
    OPERATOR_VALUE = process.env.PROFILE_OPERATOR_UUID;
}
