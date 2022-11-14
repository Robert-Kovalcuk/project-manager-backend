import {BeforeInsert, Column, Entity, PrimaryGeneratedColumn} from "typeorm"
import {Format, Property, Required} from "@tsed/schema"

@Entity()
export class Session {
    @PrimaryGeneratedColumn()
    public id: number

    @Property()
    @Column({
        unique: true
    })
    public guid: string

    @Column()
    @Property()
    @Required()
    public userId: number

    @Column()
    @Format("date-time")
    public expires: Date

    @BeforeInsert()
    private genUID(): string {
        this.guid = (
        Math.random()
            .toString(36)
            .substring(2, 15) +
        Math.random()
            .toString(36)
            .substring(2, 15))

        return this.guid
    }

    @BeforeInsert()
    private setExpires(): void {
        this.expires = new Date()
        this.expires.setHours(this.expires.getHours() + 1)
    }
}
