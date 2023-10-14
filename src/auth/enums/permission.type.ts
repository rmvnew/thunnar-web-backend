import { ProfileValueService } from "src/common/profile.values";

export class AccessProfile {
    static profileValues = new ProfileValueService();

    static USER = AccessProfile.profileValues.USER_VALUE;
    static ADMIN = AccessProfile.profileValues.ADMIN_VALUE;
    static OPERATOR = AccessProfile.profileValues.OPERATOR_VALUE;
    static USER_AND_ADMIN = [
        AccessProfile.profileValues.USER_VALUE,
        AccessProfile.profileValues.ADMIN_VALUE];
    static ALL = [
        AccessProfile.profileValues.USER_VALUE,
        AccessProfile.profileValues.ADMIN_VALUE,
        AccessProfile.profileValues.OPERATOR_VALUE
    ];
}