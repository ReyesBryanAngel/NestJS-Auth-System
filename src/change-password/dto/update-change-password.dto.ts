import { PartialType } from '@nestjs/swagger';
import { CreateChangePasswordDto } from './create-change-password.dto';

export class UpdateChangePasswordDto extends PartialType(CreateChangePasswordDto) {}
