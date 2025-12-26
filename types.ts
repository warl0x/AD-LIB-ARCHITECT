
export enum ArtistStyle {
  TRAP = 'Trap (Modern, energetic)',
  OLD_SCHOOL = 'Old School (Classic, storytelling)',
  MELODIC = 'Melodic (Smooth, sung)',
  DRILL = 'Drill (Aggressive, gritty)',
  GRIME = 'Grime (Fast-paced, punchy)',
  HYPERPOP = 'Hyperpop (High-energy, glitchy)',
  EMO_RAP = 'Emo Rap (Moody, melodic)',
  R_AND_B = 'R&B (Soulful, sensual)',
  RAGE = 'Rage (Distorted, high-energy)',
  WEST_COAST = 'West Coast (Funky, bouncing)',
  AFROBEATS = 'Afrobeats (Rhythmic, melodic)',
  BOOM_BAP = 'Boom Bap (Raw, classic)',
  PLUGG = 'Plugg (Ambient, ethereal)',
  REGGAETON = 'Reggaeton (Dance, rhythmic)',
  GLITCH_CORE = 'Glitchcore (Experimental, chaotic)',
  PHONK = 'Phonk (Dark, bass-heavy)',
  CHILL_DRILL = 'Chill Drill (Ambient, melodic)',
  LATIN_TRAP = 'Latin Trap (Rhythmic, urban)',
  COMEDY = 'Comedy (Funny, sarcastic, sound effects)',
  HORROR = 'Horror (Eerie, dark, cinematic)'
}

export interface AdLibResponse {
  annotatedLyrics: string;
  generalAdLibs: string[];
  vibeAnalysis: string;
  signatureCall: string;
}

export interface AppState {
  lyrics: string;
  style: ArtistStyle;
  loading: boolean;
  result: AdLibResponse | null;
  error: string | null;
}
