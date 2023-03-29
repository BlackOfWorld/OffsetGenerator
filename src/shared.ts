export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
export let tables: offsetTable[] = [];
export interface winData {
  name: string;
  id: number;
  offset: number;
  ordinal: number;
}

export interface winType {
  name: string | null;
  id: number;
  kind: string;
  sizeof: number;
  data: winData[] | undefined;
}

export interface winOS {
  arch: string;
  buildnumber: string;
  family: string;
  osname: string;
  timestamp: number;
  types: winType[];
}


export interface offsetTable {
  family: string;
  buildNumber: string;
  arch: string;
  data: offsetData[];
}

export interface offsetData {
  name: string;
  variables: winData[];
}