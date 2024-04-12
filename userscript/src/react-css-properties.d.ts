import 'react';

type CSSVariableNameTemplate = `--${string}`;

declare module 'react' {
  interface CSSProperties {
    [K: CSSVariableNameTemplate]: any; // allow variables to be defined
  }
}
