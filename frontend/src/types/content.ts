export interface Content {
  sharerSocketId: string;
}

export interface ImageContent extends Content {}
export interface YoutubeContent extends Content {
  link: string;
}
