import { Context, useContext } from 'react';

export function createMandatoryUseContext<T>(
  context: Context<T | null>,
  contextName: string,
): () => T {
  const hookName = `use${contextName}`;
  const providerName = `${contextName}Provider`;

  return () => {
    const value = useContext(context);
    if (!value) {
      throw new Error(
        `${hookName} can only be used within the ${providerName}`,
      );
    }

    return value;
  };
}
