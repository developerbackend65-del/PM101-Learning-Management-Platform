import { IsInt, Min } from 'class-validator';

export class ReorderModuleDto {
  @IsInt()
  @Min(0)
  orderIndex: number;
}
