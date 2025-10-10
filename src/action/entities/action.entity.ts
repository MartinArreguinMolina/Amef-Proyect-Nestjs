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
  recommendedAction: string;  // Acción recomendada

  @Column('text')
  responsible: string;        // Responsable

  @Column('date')
  targetDate: string;         // Fecha compromiso

  @Column('text', { nullable: true })
  implementedAction?: string; // Acción tomada

  @Column('date', { nullable: true })
  completionDate?: string;    // Fecha de cierre

  @Column('int', { nullable: true })
  newSeverity?: number;       // Nueva S

  @Column('int', { nullable: true })
  newOccurrence?: number;     // Nueva O

  @Column('int', { nullable: true })
  newDetection?: number;      // Nueva D

  @Column('int', { nullable: true })
  newNpr?: number;            // Nuevo NPR
}
