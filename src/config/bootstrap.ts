import { Injectable, Logger } from '@nestjs/common';
import { CreateProfileDto } from 'src/profile/dto/create-profile.dto';
import { ProfileService } from 'src/profile/profile.service';
import { CreateSysAdminDto } from 'src/user/dto/sysadmin.dto';
import { UserService } from 'src/user/user.service';


@Injectable()
export class Bootstrap {
    constructor(
        private readonly userService: UserService,
        private readonly profileService: ProfileService,


    ) { }

    private readonly logger = new Logger(Bootstrap.name)

    async onApplicationBootstrap() {


        try {

            const userHaveData = await this.userService.haveAdmin('sysadmin')

            let currentProfile = null


            const profiles = [
                {
                    profile_id: process.env.PROFILE_ADMIN_UUID,
                    name: 'ADMIN'
                },
                {
                    profile_id: process.env.PROFILE_USER_UUID,
                    name: 'USER'
                },
                {
                    profile_id: process.env.PROFILE_OPERATOR_UUID,
                    name: 'OPERATOR'
                }
            ]

            let savedProfiles = []

            for (let prof of profiles) {

                const profileHaveData = await this.profileService.haveProfile(prof.name)

                if (!profileHaveData) {

                    const profile: CreateProfileDto = {
                        profile_id: prof.profile_id,
                        profile_name: prof.name
                    }

                    const res = await this.profileService.create(profile)
                    savedProfiles.push(res)

                    if (res.profile_name === 'ADMIN') {
                        currentProfile = res
                    }

                } else {

                    if (profileHaveData.profile_name === 'ADMIN') {

                        currentProfile = profileHaveData

                    }
                }
            }


            if (!userHaveData) {

                const currentPass = process.env.SYSADMIN_PASS


                const user: CreateSysAdminDto = {
                    user_name: 'sysadmin',
                    user_email: 'rmvnew@gmail.com',
                    user_password: currentPass,
                    user_profile_id: currentProfile.profile_id,

                }


                const result = await this.userService.createSysAdmin(user)

                // this.logger.log('Profiles: ', { savedProfiles })
                // this.logger.log('Create sysadmin: ', { result })

            }
        } catch (error) {
            this.logger.error(error)
        }


    }
}