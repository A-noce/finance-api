import { PartialType } from "@nestjs/mapped-types";
import { CreateTagRequestDTO } from "@tag/dtos/create-tag.request.dto";

export class UpdateTagHistoryRequestDTO extends PartialType(CreateTagRequestDTO) {}