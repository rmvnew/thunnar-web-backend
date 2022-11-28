import { User } from "src/user/entities/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('tb_profile')
export class ProfileEntity {
    @PrimaryGeneratedColumn()
        profile_id: number

    @Column()
    profile_name: string

    @OneToMany(() => User, (user) => user.profile)
    users: User[];
}
