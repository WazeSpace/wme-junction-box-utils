export type Preferences = {
  master_disable: boolean;
  prefs_location: 'tab' | 'wme-prefs';
  roundabout: {
    clone_geometry: 'ask' | boolean;
    instruction_normalization: {
      applied_instruction_badge_type: 'graphical' | 'textual';
    };
  };
  auto_backup: boolean;
  auto_set_roundabuot_lane_guidance_turn_arrows: boolean;
  feat_discovers: {
    auto_restore: boolean;
    auto_roundabout_lane_guidance_turn_arrows: boolean;
  };
};

export const defaultPreferences: Preferences = {
  master_disable: false,
  prefs_location: 'tab',
  roundabout: {
    clone_geometry: 'ask',
    instruction_normalization: {
      applied_instruction_badge_type: 'graphical',
    },
  },
  auto_backup: true,
  auto_set_roundabuot_lane_guidance_turn_arrows: true,
  feat_discovers: {
    auto_restore: false,
    auto_roundabout_lane_guidance_turn_arrows: false,
  },
};

export const PREFERENCES_LS_KEY = 'r0den.userscripts.jbu.prefs';
