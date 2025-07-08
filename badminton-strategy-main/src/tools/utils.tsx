export const translateWinningShot = (shot: string): string => {
  const translations: Record<string, string> = {
    // 🏆 Points gagnants
    "Winning smash": "Smash gagnant",
    "Winning drop shot": "Amorti gagnant",
    "Winning clear": "Dégagement gagnant",
    "Winning net shot": "Amorti au filet gagnant",
    "Winning drive": "Drive gagnant",
    "Net kill": "Tuer au filet",
    "Body smash": "Smash dans le corps",
    "Cross-court drop shot": "Amorti croisé gagnant",
    "Deceptive shot winner": "Feinte gagnante",
    "Opponent hit into net": "Adversaire dans le filet",
    "Opponent hit out": "Adversaire hors des limites",
    "Opponent service fault": "Faute de service adverse",
    "Opponent double hit": "Double touche de l’adversaire",
    "Opponent foot fault": "Faute de pied de l’adversaire",
    "Opponent misjudgment": "Mauvais jugement de l’adversaire",
  };

  return translations[shot] || shot;
};

export const translateLoosingShot = (shot: string): string => {
  const translations: Record<string, string> = {
    // ❌ Points perdus
    "Smash into the net": "Smash dans le filet",
    "Drop shot into the net": "Amorti dans le filet",
    "Clear out of bounds": "Dégagement hors des limites",
    "Drive out of bounds": "Drive hors des limites",
    "Net shot fault": "Faute au filet",
    "Service fault": "Faute de service",
    "Double hit": "Double touche",
    "Frame hit": "Touche avec le cadre",
    "Body hit (own side)": "Touche corporelle",
    "Misjudgment (let in)": "Mauvais jugement",
    "Unforced error": "Erreur non forcée",
    "Forced error": "Erreur forcée",
    "Bad footwork": "Mauvais déplacement",
    "Late reaction": "Réaction tardive",
    "Poor defense at net": "Mauvaise défense au filet",
    "Poor clear": "Dégagement raté",
    "Lift too short": "Relevé trop court",
    "Return into the net": "Retour dans le filet",
    "Out of bounds return": "Retour hors des limites",
    "Enemy winning smash": "Smash gagnant de l’adversaire",
    "Enemy winning drop": "Amorti gagnant de l’adversaire",
    "Enemy winning net kill": "Kill au filet de l’adversaire",
    "Enemy winning drive": "Drive gagnant de l’adversaire",
    "Enemy winning cross court": "Croisé gagnant de l’adversaire",
    "Enemy winning clear": "Dégagement gagnant de l’adversaire",
    "Enemy winning push": "Poussette gagnante de l’adversaire",
    "Enemy winning flick serve": "Service flick gagnant de l’adversaire",
  };

  return translations[shot] || shot;
};
