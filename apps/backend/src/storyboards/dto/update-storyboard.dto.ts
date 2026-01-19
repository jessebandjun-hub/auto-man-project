import { PartialType } from '@nestjs/mapped-types';
import { CreateStoryboardDto } from './create-storyboard.dto';

export class UpdateStoryboardDto extends PartialType(CreateStoryboardDto) {}
