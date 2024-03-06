export type Preferences = {
  roundabout: {
    clone_geometry: boolean;
    instruction_normalization: {
      applied_instruction_badge_type: 'graphical' | 'textual';
    };
  };
};

export const defaultPreferences: Preferences = {
  roundabout: {
    clone_geometry: false,
    instruction_normalization: {
      applied_instruction_badge_type: 'graphical',
    },
  },
};
