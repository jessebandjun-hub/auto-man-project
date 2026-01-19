export class CreateStoryboardDto {
  episodeId!: string;
  sortOrder!: number;
  shotType?: string;
  action?: string;
  dialogue?: string;
  prompt?: string;
}
