type IsObject<T> = T extends object
  ? T extends string | number | boolean | symbol
    ? false
    : true
  : false;

type DefaultFlattenKeysTypes = string | number | boolean;
export type FlattenKeys<
  T,
  Delimiter extends string = '.',
  U = DefaultFlattenKeysTypes | Array<DefaultFlattenKeysTypes>,
> = T extends object
  ? {
      [K in keyof T]-?: K extends U
        ? IsObject<T[K]> extends true // the IsObject used here is a hack, because typescript treats string literal unions as objects
          ? `${K & string}${Delimiter}${FlattenKeys<T[K], Delimiter>}`
          : K & string
        : never;
    }[keyof T]
  : '';

export type GetNestedType<
  T,
  Key extends string,
> = Key extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? GetNestedType<T[K], Rest>
    : never
  : Key extends keyof T
    ? T[Key]
    : never;
