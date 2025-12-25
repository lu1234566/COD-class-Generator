
export enum GameSystem {
  CLASSIC_3_PERK = 'CLASSIC_3_PERK',
  PICK_10 = 'PICK_10',
  PICK_13 = 'PICK_13',
  GHOSTS_POINTS = 'GHOSTS_POINTS',
  GUNSMITH_5 = 'GUNSMITH_5',
  GEAR_SYSTEM = 'GEAR_SYSTEM'
}

export type RuleMode = 'classic' | 'modern';

export interface CoDGame {
  id: string;
  name: string;
  year: number;
  system: GameSystem;
  image: string;
}

export interface Loadout {
  id?: string;
  isFavorite?: boolean;
  ruleMode?: RuleMode;
  primary?: {
    name: string;
    category: string;
    weaponSource?: 'Base' | 'Desafio' | 'Clássica' | 'Supply Drop' | 'Prestige' | 'DLC';
    attachments: string[];
    isSupplyDrop?: boolean;
    operatorMod?: string;
  };
  secondary?: {
    name: string;
    category: string;
    weaponSource?: 'Base' | 'Desafio' | 'Clássica' | 'Supply Drop' | 'Prestige' | 'DLC';
    attachments: string[];
    isSupplyDrop?: boolean;
  };
  lethal?: string[];
  tactical?: string[];
  equipment?: string; 
  exoAbility?: string;
  exoLauncher?: string;
  division?: string;
  basicTraining?: string;
  gear?: string[]; 
  vest?: string;
  gloves?: string;
  boots?: string;
  specialty?: string; 
  specialist?: {
    name: string;
    action?: string;
    weapon?: string;
    specialIssue?: string;
    type?: 'Weapon' | 'Ability';
  };
  combatRig?: {
    name: string;
    payload: string;
    trait: string;
  };
  perks: {
    slot1: string[];
    slot2: string[];
    slot3: string[];
    special?: string[]; 
  };
  strikePackage?: 'Assault' | 'Support' | 'Specialist';
  killstreaks?: string[];
  scorestreaks?: { name: string; cost?: number }[];
  deathstreak?: string;
  wildcards?: string[];
  fieldUpgrade?: string;
  pointsUsed?: number;
  observations?: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
