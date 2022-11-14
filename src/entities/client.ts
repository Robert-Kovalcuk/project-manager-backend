import {BeforeInsert, Column, Entity} from "typeorm"
import {Enum, Format, Property} from "@tsed/schema"
import {Comment} from "./comment"
import {BaseEntity} from "./baseEntity"
import {Note} from "./note"

@Entity()
export class Client extends BaseEntity {
    @Property()
    @Column()
    public title: string

    @Property()
    @Column()
    public name: string

    @Property()
    @Column()
    public phone: string

    @Property()
    @Column()
    @Format("email")
    public email: string

    @Property()
    @Column()
    @Enum("active", "notActive")
    public status: string

    @Property()
    @Column()
    public from: Date

    @Property()
    @Column()
    public to: Date

    @Property()
    @Column()
    public activeLines: number

    @Column(()=> Comment)
    comments: Comment[]

    @Column(() => Note)
    note: Note

    @BeforeInsert()
    private init(): void {
        this.comments = []
        this.note.note = ""
    }
}
