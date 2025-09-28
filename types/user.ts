export interface IUser {
  address: string;
  status: string;
  tokenId: number;
  hash: string;
  createdAt: string;
  updatedAt: string;
  attestations: string[];
  storyProgress?: {
    attestations: any;
    choices: any;
    completedNodes: any;
  };
}
