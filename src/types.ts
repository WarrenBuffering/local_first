export type FishCatch = {
  id: string;
  species_name: string;
  length: string;
  weight: string;
};

export type NestedPartial<T> = {
  [P in keyof T]?: NestedPartial<T[P]>;
};

export type PartialFishCatch = Partial<
  Omit<FishCatch, 'id'> & Pick<FishCatch, 'id'>
>;

export type CreateError = {
  id: string;
  species_name: string;
  length: number | string;
  weight: number;
  errors: string[];
};

export type DeleteError = {
  id: string | number;
  error: string;
};

export type BulkCreateResponse = {
  ok: FishCatch[];
  errors: CreateError[];
};

export type BulkDeleteResponse = {
  ok: FishCatch[];
  errors: DeleteError[];
};

export type RequestResponse<T> = {
  data: T | null;
  error: {
    code: string;
    message: string;
  } | null;
};
