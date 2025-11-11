import { Analysis } from "src/analysis/entities/analysis.entity";
import { User } from "src/auth/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class CommentAnalysis {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    comment: string;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz', nullable: true })
    updatedAt: Date | null;

    @ManyToOne(
        () => User,
        (user) => user.comment,
        {eager: true}
    )
    user: User;

    @ManyToOne(
        () => Analysis,
        (analysis) => analysis.commentAnalysis,
        { onDelete: 'CASCADE', eager: true},
    )
    analysis: Analysis;
}
