import { getWazeMapEditorWindow } from '@/utils/get-wme-window';

interface Version {
  M: number;
  m: number;
  p: number;
}
type VersionDependantConfigurationObject<T> = {
  v: null | Partial<Version>;
} & T;

function useCurrentMapEditorVersion(): Version {
  const rawVersion = getWazeMapEditorWindow().W.version;
  const patchIndex = rawVersion.indexOf('-');
  const patchIndexEnd = rawVersion.indexOf('-', patchIndex + 1);
  const trimmedVersionString = rawVersion.substring(1, patchIndex);
  const patchString = rawVersion.substring(patchIndex + 1, patchIndexEnd);
  const versionParts = trimmedVersionString.split('.');
  return {
    M: parseInt(versionParts[0]),
    m: parseInt(versionParts[1]),
    p: parseInt(patchString),
  };
}

export function useVersionDependantConfig<T>(
  configurations: VersionDependantConfigurationObject<T>[],
): T {
  const currentVersion = useCurrentMapEditorVersion();
  const compareVersions = (
    majorA: number,
    majorB: number,
    minorA: number | undefined,
    minorB: number | undefined,
    patchA: number | undefined,
    patchB: number | undefined,
  ): number => {
    if (majorA > majorB) return 1;
    if (majorA < majorB) return -1;

    if (minorA !== undefined && minorB !== undefined) {
      if (minorA > minorB) return 1;
      if (minorA < minorB) return -1;
    }

    if (patchA !== undefined && patchB !== undefined) {
      if (patchA > patchB) return 1;
      if (patchB < patchA) return -1;
    }

    return 0;
  };
  const isVersionAtLeast = (
    major: number,
    minor?: number,
    patch?: number,
  ): boolean => {
    return (
      compareVersions(
        currentVersion.M,
        major,
        currentVersion.m,
        minor,
        currentVersion.p,
        patch,
      ) >= 0
    );
  };

  let greatestOption: VersionDependantConfigurationObject<T> = null;
  for (const option of configurations) {
    const { v } = option;
    if (!v) {
      // if there is no version specified, we want to use this option if it is the first one we find
      if (greatestOption == null) {
        greatestOption = option;
      }

      continue;
    }

    // we have to validate the version specified in the option is suitable for the current version
    if (isVersionAtLeast(v.M, v.m, v.p)) {
      // we want to validate this option has a higher version than the previous greatest option
      if (
        !greatestOption?.v ||
        compareVersions(
          v.M,
          greatestOption.v.M,
          v.m,
          greatestOption.v.m,
          v.p,
          greatestOption.v.p,
        ) > 0
      ) {
        greatestOption = option;
      }
    }
  }

  if (!greatestOption)
    throw new Error('No suitable configuration found for current version');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { v, ...rest } = greatestOption;
  return rest as T;
}
