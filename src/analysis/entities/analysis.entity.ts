import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { OrganizationalInformation } from "src/organizational-information/entities/organizational-information.entity";
import { Action } from 'src/action/entities/action.entity';

@Entity()
export class Analysis {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Relación con el encabezado
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
    systemFunction: string;   // Sistema / Función

    @Column('text')
    failureMode: string;      // Potencial modo de fallo

    @Column('text')
    failureEffects: string;   // Efectos de los potenciales fallos

    @Column('int')
    severity: number;         // S (Severidad)

    @Column('text')
    failureCauses: string;    // Potenciales causas de los fallos

    @Column('int')
    occurrence: number;       // O (Ocurrencia)

    @Column('text', { nullable: true })
    currentControls?: string; // Controles de prevención

    @Column('int')
    detection: number;        // D (Detección)

    @Column('int')
    npr: number;              // NPR = S * O * D
}
