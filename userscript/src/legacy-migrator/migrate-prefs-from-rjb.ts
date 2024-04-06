import { Preferences } from '@/preferences';

const LEGACY_PREFS_LS_KEY = 'r0den.scripts.roundabout-jb.prefs';

function transformLegacyPrefsToCurrent(legacyPrefs: any): Preferences {
  return {
    roundabout: {
      clone_geometry: Boolean(legacyPrefs.auto_round_jb),
      instruction_normalization: {
        applied_instruction_badge_type:
          legacyPrefs.normalize_badge_style === 'icons'
            ? 'graphical'
            : 'textual',
      },
    },
  };
}

export function migratePreferencesFromRoundaboutJB() {
  const legacyPrefs = localStorage.getItem(LEGACY_PREFS_LS_KEY);
  if (!legacyPrefs) return;

  debugger;
  const currentPrefs = transformLegacyPrefsToCurrent(JSON.parse(legacyPrefs));
  localStorage.setItem(
    'r0den.userscripts.jbu.prefs',
    JSON.stringify(currentPrefs),
  );

  localStorage.removeItem(LEGACY_PREFS_LS_KEY);
}
