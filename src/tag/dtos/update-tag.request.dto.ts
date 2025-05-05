import { PartialType } from "@nestjs/mapped-types";
import { CreateTagRequestDTO } from "./create-tag.request.dto";

export class UpdateTagRequestDTO extends PartialType(CreateTagRequestDTO) {}