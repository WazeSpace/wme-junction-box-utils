export interface DataModelAttributes {
  id: number;
  createdBy: number;
  createdOn: number;
  updatedBy: number;
  updatedOn: number;
  permissions: number;
}

export interface DataModel<
  A extends DataModelAttributes = DataModelAttributes,
> {
  attributes: A;
  type: string;
  model: any;
  getAttribute<N extends keyof A>(attributeName: N): A[N];
}

export type ExtractAttributesFromDataModel<T> =
  T extends DataModel<infer U> ? U : never;