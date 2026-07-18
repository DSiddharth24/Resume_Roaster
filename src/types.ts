export interface Callout {
  original: string;
  issue: string;
  rewrite: string;
}

export interface RoastResponse {
  verdict: string;
  sixSecondTest: string;
  callouts: Callout[];
  compliment: string;
}

export interface FileData {
  name: string;
  mimeType: string;
  base64: string;
}
