import * as bcrypt from "bcrypt"
import {BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import {Email, MaxLength, Property, Required} from "@tsed/schema"
import {Project} from "./project"

@Entity()
export class User {
    @Property()
    @PrimaryGeneratedColumn()
    public id: number

    @Column({
        unique: true
    })
    @MaxLength(100)
    @Required()
    @Email()
    public email: string

    @Column({
        select: true
    })
    @MaxLength(100)
    @Required()
    public password: string

    @OneToMany(type => Project, project => project.admin, {cascade: true})
    public projects: Project[]

    @BeforeInsert()
    private async hashPassword(): Promise<string> {
        const SALT_ROUNDS = await bcrypt.genSalt(10)

        const hash = await bcrypt.hash(this.password, SALT_ROUNDS)
        this.password = hash

        return hash
    }
}