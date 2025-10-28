import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { OrganizationalInformation } from "src/organizational-information/entities/organizational-information.entity";
import { Action } from 'src/action/entities/action.entity';
import { CommentAnalysis } from 'src/comments/entities/comment.entity';

@Entity()
export class Analysis {

    @PrimaryGeneratedColumn('uuid')
    id: string;
    @ManyToOne(
        () => OrganizationalInformation,
        (organizationalInformation) => organizationalInformation.analysis,
        { onDelete: 'CASCADE' }
    )
    organizationalInformation: OrganizationalInformation;

    @OneToMany(
        () => Action,
        (action) => action.analysis,
        { cascade: true , eager: true }
    )
    actions: Action[];

    @Column('text')
    systemFunction: string;   

    @Column('text')
    failureMode: string;      

    @Column('text')
    failureEffects: string;   

    @Column('int')
    severity: number;         

    @Column('text')
    failureCauses: string;   

    @Column('int')
    occurrence: number;      

    @Column('text', { nullable: true })
    currentControls?: string; 

    @Column('int')
    detection: number;        

    @Column('int')
    npr: number;          
    
    @OneToMany(
        () => CommentAnalysis,
        (commentAnalysis) => commentAnalysis.analysis,
        {cascade: true}
    )
    commentAnalysis:CommentAnalysis[]
}
