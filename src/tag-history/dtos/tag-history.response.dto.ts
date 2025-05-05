import { TagResponseDTO } from "@tag/dtos/tag.response.dto";
import { Expose } from "class-transformer";

export class TagHistoryResponseDTO extends TagResponseDTO {
    @Expose()
    tagId: number
}