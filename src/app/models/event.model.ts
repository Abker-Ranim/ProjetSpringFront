

export interface Manager {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  description?: string;
  password?: string;
}


export interface Poste {
  id: number;
  title: string;
  type: string;
  description: string;
  competences: string[];
}

export interface Event {
  id: number;
title: string;
description: string;
location: string;
startDate: Date;
endDate: Date;
createdAt: Date;
organization?: string;
participants?: number;
technology?: string;
benefits?: string;
vision?: string;
imagePath?: string;
imageUrl?: string;
postes?: Poste[];
responsiblePerson?: Manager;


}

export interface Candidate {
  poste: string;
  nom: string;
  email: string;
  telephone: string;
  motivation: string;
  experience: string;
  fichier: string;
}
