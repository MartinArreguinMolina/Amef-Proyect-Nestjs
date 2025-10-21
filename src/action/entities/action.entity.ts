import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Analysis } from "src/analysis/entities/analysis.entity";

@Entity()
export class Action {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => Analysis,
    (analysis) => analysis.actions,
    { onDelete: 'CASCADE' }
  )
  analysis: Analysis;

  @Column('text')
  recommendedAction: string; 

  @Column('text')
  responsible: string;       

  @Column('date')
  targetDate: string;        

  @Column('text', { nullable: true })
  implementedAction?: string; 

  @Column('date', { nullable: true })
  completionDate?: string;   

  @Column('int', { nullable: true })
  newSeverity?: number;  

  @Column('int', { nullable: true })
  newOccurrence?: number;  

  @Column('int', { nullable: true })
  newDetection?: number;      

  @Column('int', { nullable: true })
  newNpr?: number;           
}
