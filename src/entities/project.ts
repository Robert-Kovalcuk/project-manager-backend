import {Default, Enum, Format, MaxLength, Property, Required} from "@tsed/schema"
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm"
import {User} from "./user"

@Entity()
export class Project {
    @Property()
    @PrimaryGeneratedColumn()
    public id: number

    @Column({
        unique: true,
    })
    @Required()
    @MaxLength(100)
    public name: string

    @Column()
    @Required()
    public category: "hardware" | "software"

    @Column()
    @Default("Not started")
    public status: string = "Not started"

    @Column()
    @Format("date")
    public deadline: Date = new Date(0)

    @Column()
    public totalCost: number = 0

    @Property()
    @ManyToOne(type => User, user => user.projects)
    @Required()
    public admin: User
}