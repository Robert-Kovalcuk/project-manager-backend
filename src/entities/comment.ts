import {Column} from "typeorm"

export class Comment {
    @Column({
        type: "simple-array",
        nullable: true,
    })
    comments: string[] = []
}
