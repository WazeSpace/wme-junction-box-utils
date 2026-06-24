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

import { Logger } from '@/logger';

export function migratePreferencesFromRoundaboutJB() {
  const legacyPrefs = localStorage.getItem(LEGACY_PREFS_LS_KEY);
  if (!legacyPrefs) {
    Logger.debug('No legacy roundabout-jb preferences found');
    return;
  }

  Logger.info('Found legacy roundabout-jb preferences, starting migration');

  try {
    const currentPrefs = transformLegacyPrefsToCurrent(JSON.parse(legacyPrefs));
    localStorage.setItem(
      'r0den.userscripts.jbu.prefs',
      JSON.stringify(currentPrefs),
    );

    localStorage.removeItem(LEGACY_PREFS_LS_KEY);
    Logger.info('Legacy roundabout-jb preferences migrated and removed');
  } catch (err) {
    Logger.error('Failed to migrate legacy roundabout-jb preferences', err);
  }
}
