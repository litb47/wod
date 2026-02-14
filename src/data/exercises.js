export const exercises = [
  // ═══════════════════════════════════════════════════════
  // WEIGHTLIFTING (W) — 22 exercises
  // ═══════════════════════════════════════════════════════
  { id: 'w01', name: 'Power Snatch', modality: 'W', defaultReps: 3, defaultSets: 5, defaultWeight: '60 kg', aliases: ['pwr snatch', 'p. snatch'] },
  { id: 'w02', name: 'Squat Snatch', modality: 'W', defaultReps: 2, defaultSets: 5, defaultWeight: '70 kg', aliases: ['full snatch', 'snatch'] },
  { id: 'w03', name: 'Hang Snatch', modality: 'W', defaultReps: 3, defaultSets: 4, defaultWeight: '55 kg', aliases: ['hang sn'] },
  { id: 'w04', name: 'Power Clean', modality: 'W', defaultReps: 3, defaultSets: 5, defaultWeight: '70 kg', aliases: ['pwr clean', 'p. clean'] },
  { id: 'w05', name: 'Squat Clean', modality: 'W', defaultReps: 2, defaultSets: 5, defaultWeight: '80 kg', aliases: ['full clean', 'clean'] },
  { id: 'w06', name: 'Hang Power Clean', modality: 'W', defaultReps: 3, defaultSets: 4, defaultWeight: '65 kg', aliases: ['hpc', 'hang clean'] },
  { id: 'w07', name: 'Split Jerk', modality: 'W', defaultReps: 2, defaultSets: 5, defaultWeight: '75 kg', aliases: ['jerk'] },
  { id: 'w08', name: 'Push Jerk', modality: 'W', defaultReps: 3, defaultSets: 5, defaultWeight: '70 kg', aliases: ['p. jerk'] },
  { id: 'w09', name: 'Clean & Jerk', modality: 'W', defaultReps: 1, defaultSets: 5, defaultWeight: '85 kg', aliases: ['c&j', 'cnj', 'clean and jerk'] },
  { id: 'w10', name: 'Deadlift', modality: 'W', defaultReps: 5, defaultSets: 5, defaultWeight: '100 kg', aliases: ['dl', 'dead'] },
  { id: 'w11', name: 'Back Squat', modality: 'W', defaultReps: 5, defaultSets: 5, defaultWeight: '90 kg', aliases: ['bs', 'squat'] },
  { id: 'w12', name: 'Front Squat', modality: 'W', defaultReps: 5, defaultSets: 5, defaultWeight: '75 kg', aliases: ['fs', 'front sq'] },
  { id: 'w13', name: 'Overhead Squat', modality: 'W', defaultReps: 3, defaultSets: 5, defaultWeight: '50 kg', aliases: ['ohs'] },
  { id: 'w14', name: 'Thruster', modality: 'W', defaultReps: 10, defaultSets: 3, defaultWeight: '43 kg', aliases: ['thrusters'] },
  { id: 'w15', name: 'Cluster', modality: 'W', defaultReps: 3, defaultSets: 5, defaultWeight: '60 kg', aliases: ['clusters'] },
  { id: 'w16', name: 'Strict Press', modality: 'W', defaultReps: 5, defaultSets: 5, defaultWeight: '45 kg', aliases: ['shoulder press', 'press', 'sp'] },
  { id: 'w17', name: 'Push Press', modality: 'W', defaultReps: 5, defaultSets: 5, defaultWeight: '55 kg', aliases: ['pp'] },
  { id: 'w18', name: 'Sumo Deadlift High Pull', modality: 'W', defaultReps: 10, defaultSets: 3, defaultWeight: '35 kg', aliases: ['sdhp', 'sumo dl hp'] },
  { id: 'w19', name: 'Hang Squat Clean', modality: 'W', defaultReps: 3, defaultSets: 4, defaultWeight: '65 kg', aliases: ['hang full clean', 'hsc'] },
  { id: 'w20', name: 'Power Snatch + OHS', modality: 'W', defaultReps: 2, defaultSets: 5, defaultWeight: '50 kg', aliases: ['snatch complex'] },
  { id: 'w21', name: 'Clean Pull', modality: 'W', defaultReps: 3, defaultSets: 4, defaultWeight: '90 kg', aliases: ['cl pull'] },
  { id: 'w22', name: 'Snatch Pull', modality: 'W', defaultReps: 3, defaultSets: 4, defaultWeight: '75 kg', aliases: ['sn pull'] },

  // ═══════════════════════════════════════════════════════
  // GYMNASTICS (G) — 29 exercises
  // ═══════════════════════════════════════════════════════
  { id: 'g01', name: 'Strict Pull-ups', modality: 'G', defaultReps: 10, defaultSets: 3, defaultWeight: 'BW', aliases: ['strict pu', 'pull-ups strict'] },
  { id: 'g02', name: 'Kipping Pull-ups', modality: 'G', defaultReps: 15, defaultSets: 3, defaultWeight: 'BW', aliases: ['kipping pu', 'pull-ups'] },
  { id: 'g03', name: 'Butterfly Pull-ups', modality: 'G', defaultReps: 15, defaultSets: 3, defaultWeight: 'BW', aliases: ['butterfly pu'] },
  { id: 'g04', name: 'Chest-to-Bar Pull-ups', modality: 'G', defaultReps: 10, defaultSets: 3, defaultWeight: 'BW', aliases: ['c2b', 'ctb', 'chest to bar'] },
  { id: 'g05', name: 'Toes-to-Bar', modality: 'G', defaultReps: 12, defaultSets: 3, defaultWeight: 'BW', aliases: ['ttb', 't2b', 'toes to bar'] },
  { id: 'g06', name: 'Bar Muscle-ups', modality: 'G', defaultReps: 5, defaultSets: 3, defaultWeight: 'BW', aliases: ['bar mu', 'bmu'] },
  { id: 'g07', name: 'Ring Muscle-ups', modality: 'G', defaultReps: 3, defaultSets: 5, defaultWeight: 'BW', aliases: ['ring mu', 'rmu', 'muscle-ups'] },
  { id: 'g08', name: 'Strict HSPU', modality: 'G', defaultReps: 5, defaultSets: 5, defaultWeight: 'BW', aliases: ['strict handstand push-ups', 'strict hspu'] },
  { id: 'g09', name: 'Kipping HSPU', modality: 'G', defaultReps: 10, defaultSets: 3, defaultWeight: 'BW', aliases: ['hspu', 'handstand push-ups', 'kip hspu'] },
  { id: 'g10', name: 'Handstand Walk', modality: 'G', defaultReps: 15, defaultSets: 3, defaultWeight: 'BW', aliases: ['hs walk', 'hsw'] },
  { id: 'g11', name: 'Box Jumps', modality: 'G', defaultReps: 20, defaultSets: 3, defaultWeight: '24"', aliases: ['bj', 'box jump'] },
  { id: 'g12', name: 'Burpees', modality: 'G', defaultReps: 15, defaultSets: 3, defaultWeight: 'BW', aliases: ['burpee'] },
  { id: 'g13', name: 'Bar-facing Burpees', modality: 'G', defaultReps: 12, defaultSets: 3, defaultWeight: 'BW', aliases: ['bfb', 'bar facing burpees'] },
  { id: 'g14', name: 'Box-over Burpees', modality: 'G', defaultReps: 12, defaultSets: 3, defaultWeight: 'BW', aliases: ['bob', 'burpee box jump over'] },
  { id: 'g15', name: 'Pistol Squats', modality: 'G', defaultReps: 10, defaultSets: 3, defaultWeight: 'BW', aliases: ['pistols', 'single leg squat'] },
  { id: 'g16', name: 'Rope Climbs', modality: 'G', defaultReps: 3, defaultSets: 3, defaultWeight: 'BW', aliases: ['rope climb', 'rc'] },
  { id: 'g17', name: 'Wall Balls', modality: 'G', defaultReps: 20, defaultSets: 3, defaultWeight: '9 kg', aliases: ['wb', 'wall ball shots'] },
  { id: 'g18', name: 'Walking Lunges', modality: 'G', defaultReps: 20, defaultSets: 3, defaultWeight: 'BW', aliases: ['lunges', 'wl'] },
  { id: 'g19', name: 'GHD Sit-ups', modality: 'G', defaultReps: 15, defaultSets: 3, defaultWeight: 'BW', aliases: ['ghd', 'ghd situps'] },
  { id: 'g20', name: 'AbMat Sit-ups', modality: 'G', defaultReps: 20, defaultSets: 3, defaultWeight: 'BW', aliases: ['sit-ups', 'situps', 'abmat'] },
  { id: 'g21', name: 'Ring Dips', modality: 'G', defaultReps: 10, defaultSets: 3, defaultWeight: 'BW', aliases: ['dips', 'ring dip'] },
  { id: 'g22', name: 'L-Sit', modality: 'G', defaultReps: 1, defaultSets: 5, defaultWeight: 'BW', aliases: ['l-sit hold', 'l sit'] },
  { id: 'g23', name: 'Knees-to-Elbows', modality: 'G', defaultReps: 12, defaultSets: 3, defaultWeight: 'BW', aliases: ['k2e', 'kte', 'knees to elbows'] },
  { id: 'g24', name: 'Hollow Rocks', modality: 'G', defaultReps: 20, defaultSets: 3, defaultWeight: 'BW', aliases: ['hollow rock', 'hollows'] },
  { id: 'g25', name: 'Ring Rows', modality: 'G', defaultReps: 12, defaultSets: 3, defaultWeight: 'BW', aliases: ['ring row', 'inverted rows'] },
  { id: 'g26', name: 'Deficit HSPU', modality: 'G', defaultReps: 5, defaultSets: 5, defaultWeight: 'BW', aliases: ['deficit handstand push-ups', 'deficit hspu'] },
  { id: 'g27', name: 'Push-ups', modality: 'G', defaultReps: 20, defaultSets: 3, defaultWeight: 'BW', aliases: ['push-up', 'pushups', 'pushup', 'press-ups'] },
  { id: 'g28', name: 'Air Squats', modality: 'G', defaultReps: 20, defaultSets: 3, defaultWeight: 'BW', aliases: ['air squat', 'bodyweight squat', 'bw squat', 'squats'] },
  { id: 'g29', name: 'Box Step-ups', modality: 'G', defaultReps: 20, defaultSets: 3, defaultWeight: '20"', aliases: ['step-ups', 'step ups', 'box step up', 'step-up'] },

  // ═══════════════════════════════════════════════════════
  // MONOSTRUCTURAL (M) — 13 exercises
  // ═══════════════════════════════════════════════════════
  { id: 'm01', name: 'Run', modality: 'M', defaultReps: 400, defaultSets: 1, defaultWeight: 'm', aliases: ['running', 'sprint'] },
  { id: 'm02', name: 'Row (Calories)', modality: 'M', defaultReps: 20, defaultSets: 1, defaultWeight: 'cal', aliases: ['row cal', 'rowing cal', 'erg cal'] },
  { id: 'm03', name: 'Row (Meters)', modality: 'M', defaultReps: 500, defaultSets: 1, defaultWeight: 'm', aliases: ['row meters', 'rowing m', 'row m'] },
  { id: 'm04', name: 'Bike Erg', modality: 'M', defaultReps: 20, defaultSets: 1, defaultWeight: 'cal', aliases: ['bike erg cal', 'echo bike', 'bike'] },
  { id: 'm05', name: 'Assault Bike', modality: 'M', defaultReps: 20, defaultSets: 1, defaultWeight: 'cal', aliases: ['air bike', 'airdyne', 'assault'] },
  { id: 'm06', name: 'Ski Erg', modality: 'M', defaultReps: 20, defaultSets: 1, defaultWeight: 'cal', aliases: ['ski erg cal', 'ski'] },
  { id: 'm07', name: 'Double Unders', modality: 'M', defaultReps: 50, defaultSets: 3, defaultWeight: 'BW', aliases: ['du', 'dubs', 'double under'] },
  { id: 'm08', name: 'Single Unders', modality: 'M', defaultReps: 100, defaultSets: 3, defaultWeight: 'BW', aliases: ['su', 'singles', 'jump rope'] },
  { id: 'm09', name: 'Swimming', modality: 'M', defaultReps: 100, defaultSets: 1, defaultWeight: 'm', aliases: ['swim'] },
  { id: 'm10', name: 'Shuttle Run', modality: 'M', defaultReps: 25, defaultSets: 4, defaultWeight: 'm', aliases: ['shuttle'] },
  { id: 'm11', name: 'Run (Mile)', modality: 'M', defaultReps: 1, defaultSets: 1, defaultWeight: 'mile', aliases: ['mile run', '1 mile'] },
  { id: 'm12', name: 'Ski Erg (Meters)', modality: 'M', defaultReps: 500, defaultSets: 1, defaultWeight: 'm', aliases: ['ski m', 'ski meters'] },
  { id: 'm13', name: 'Bike Erg (Meters)', modality: 'M', defaultReps: 1000, defaultSets: 1, defaultWeight: 'm', aliases: ['bike m', 'bike meters', 'bike erg m'] },
]

export function searchExercises(query, customExercises = []) {
  if (!query || query.trim().length === 0) return []
  const q = query.toLowerCase().trim()
  const all = [...exercises, ...customExercises]
  return all.filter(ex => {
    if (ex.name.toLowerCase().includes(q)) return true
    if (ex.aliases.some(a => a.toLowerCase().includes(q))) return true
    return false
  }).slice(0, 12)
}

export function getExercisesByModality(modality) {
  return exercises.filter(ex => ex.modality === modality)
}
