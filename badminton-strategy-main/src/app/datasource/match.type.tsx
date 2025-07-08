export const categorizedWinningActions: {
  category: string;
  label: string;
  items: string[];
}[] = [
  {
    category: "offensive_winners",
    label: "Coups gagnants offensifs",
    items: [
      "Winning smash",
      "Winning drop shot",
      "Winning clear",
      "Winning net shot",
      "Winning drive",
      "Net kill",
      "Body smash",
      "Cross-court drop shot",
      "Deceptive shot winner",
    ],
  },
  {
    category: "opponent_faults",
    label: "Fautes de l’adversaire",
    items: [
      "Opponent hit into net",
      "Opponent hit out",
      "Opponent service fault",
      "Opponent double hit",
      "Opponent foot fault",
      "Opponent misjudgment",
    ],
  },
];

export const categorizedLosingActions: {
  category: string;
  label: string;
  items: string[];
}[] = [
  {
    category: "net_errors",
    label: "Erreurs au filet",
    items: [
      "Smash into the net",
      "Drop shot into the net",
      "Net shot fault",
      "Return into the net"
    ],
  },
  {
    category: "out_errors",
    label: "Volants dehors",
    items: [
      "Clear out of bounds",
      "Drive out of bounds",
      "Out of bounds return"
    ],
  },
  {
    category: "technical_faults",
    label: "Fautes techniques",
    items: [
      "Double hit",
      "Frame hit",
      "Body hit (own side)",
      "Service fault"
    ],
  },
  {
    category: "tactical_errors",
    label: "Erreurs tactiques",
    items: [
      "Misjudgment (let in)",
      "Unforced error",
      "Forced error"
    ],
  },
  {
    category: "movement_errors",
    label: "Déplacement/Timing",
    items: [
      "Bad footwork",
      "Late reaction",
      "Poor defense at net",
      "Poor clear",
      "Lift too short"
    ],
  },
  {
    category: "opponent_winner",
    label: "Point gagnant adverse",
    items: [
      "Enemy winning smash",
      "Enemy winning drop",
      "Enemy winning net kill",
      "Enemy winning drive",
      "Enemy winning cross court",
      "Enemy winning clear",
      "Enemy winning push",
      "Enemy winning flick serve",
    ],
  }
];

export type Hit = {
  position: { x: number; y: number }; // Position du volant
  player: string; // Joueur ayant frappé
};
export type HistoryHit =
{ winLoose: string; typeShot: string, hits: Hit[]; }

export type Set = {
  set_number: number; // 1, 2, ou 3
  points: HistoryHit[]; // l'historique des échanges pour ce set
};

export type Match = {
  user_id: string;
  timestamp: number;
  player_1_name: string;
  player_2_name?: string;
  opponent_1_name: string;
  opponent_2_name?: string;
  type: 'simple' | 'double';
  sets: Set[];
};

export type PostMatch = {
  player_1_name: string;
  player_2_name?: string;
  opponent_1_name: string;
  opponent_2_name?: string;
  type: 'simple' | 'double';
  sets: Set[];
}

export type PutMatch = {
  timestamp: number;
  player_1_name?: string;
  player_2_name?: string;
  opponent_1_name?: string;
  opponent_2_name?: string;
  sets: Set[];
}

export type DeleteMatch = {
  timestamp: number;
}