export interface metadata {
  id: string;
  fileName: string;
  youtubeTitle: string;
  correctAnswers: string[];
}

export type metadataMap = Record<string, metadata>;
