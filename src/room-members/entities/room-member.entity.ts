import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RoomMember {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    amefId: string

    @Column('uuid')
    analysisId: string;

    @Column('uuid')
    userId: string;

    @Column('timestamptz', {
        nullable: true
    })
    lastConnection: Date | null;
}
