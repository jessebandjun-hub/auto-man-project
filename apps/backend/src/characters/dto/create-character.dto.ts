export class CreateCharacterDto {
  name!: string;
  description!: string;
  projectId!: string;
  tags?: string;
  avatarUrl?: string;
}
