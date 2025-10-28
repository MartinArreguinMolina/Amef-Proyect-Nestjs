import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Department {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true
    })
    department: string


    @BeforeInsert()
    beforeInsertDeparmet(){
        this.department = this.department.trim().toLowerCase()
    }
}
