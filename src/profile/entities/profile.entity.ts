import { User } from "src/user/entities/user.entity";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity('tb_profile')
export class ProfileEntity {

    @PrimaryColumn()
    profile_id: string

    @Column()
    profile_name: string

    @OneToMany(() => User, (user) => user.profile)
    users: User[];

}
