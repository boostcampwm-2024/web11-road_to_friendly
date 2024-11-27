import { interestsYoutubeControl } from '../definition/interests.youtube.control';

export class InterestsYoutubeControlResponseDto {
  requestType: string;
  videoCurrentTime: number;
  playStatus: string;
  targetTime: number;
  playSpeed: number;

  constructor(
    requestType: string,
    videoCurrentTime: number,
    playStatus: string,
    targetTime: number,
    playSpeed: number,
  ) {
    this.requestType = requestType;
    this.videoCurrentTime = videoCurrentTime;
    this.playStatus = playStatus;
    this.targetTime = targetTime;
    this.playSpeed = playSpeed;
  }

  static of(
    requestType: interestsYoutubeControl,
    options: { videoCurrentTime?: number; playStatus?: string; targetTime?: number; playSpeed?: number } = {},
  ) {
    return new this(requestType, options.videoCurrentTime, options.playStatus, options.targetTime, options.playSpeed);
  }
}
