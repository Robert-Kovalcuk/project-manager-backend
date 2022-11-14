import {Column} from "typeorm"

export class Note {
    @Column({
        type: "text",
        nullable: true
    })
    note: string = ""
}
