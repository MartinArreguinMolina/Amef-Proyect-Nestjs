import { Analysis } from "src/analysis/entities/analysis.entity";
import { User } from "src/auth/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CommentAnalysis {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    comment: string;

    @Column('date')
    date: string;

    @Column('date',{
        nullable: true
    })
    modificationDate: string;

    @ManyToOne(
        () => User,
        (user) => user.comment
    )
    user: User;
    
    @ManyToOne(
        () => Analysis,
        (analysis) => analysis.commentAnalysis,
        { onDelete: 'CASCADE' }
    )
    analysis: Analysis;
}
