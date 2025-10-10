

export interface Amef {
    amefId:            string;
    revision:          number;
    team:              string[];
    system:            string;
    subsystem:         null;
    component:         null;
    proyectCode:       string;
    leadingDepartment: string;
    preparedBy:        PreparedBy;
    analysis:          Analysis[];
    dateOfOrigin:      Date;
    targetDate:        Date;
}

export interface Analysis {
    id:              string;
    actions:         Action[];
    systemFunction:  string;
    failureMode:     string;
    failureEffects:  string;
    severity:        number;
    failureCauses:   string;
    occurrence:      number;
    currentControls: string;
    detection:       number;
    npr:             number;
}

export interface Action {
    id:                string;
    recommendedAction: string;
    responsible:       string;
    targetDate:        Date;
    implementedAction: null;
    completionDate:    null;
    newSeverity:       null;
    newOccurrence:     null;
    newDetection:      null;
    newNpr:            null;
}

export interface PreparedBy {
    id:       string;
    fullName: string;
    email:    string;
    isActive: boolean;
    roles:    Role[];
}

export interface Role {
    id:  string;
    rol: string;
}
