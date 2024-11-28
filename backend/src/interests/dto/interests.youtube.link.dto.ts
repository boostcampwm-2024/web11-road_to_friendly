import { IsYoutubeLink } from '../decorator/is-youtube-link.decorator';

export class InterestsYoutubeLinkDto {
  @IsYoutubeLink()
  link: string;
}
