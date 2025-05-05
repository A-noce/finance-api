import { PartialType } from "@nestjs/mapped-types";
import { CreateTransactionRequestDTO } from "./create-transaction.request.dto";

export class UpdateTransactiopnRequestDTO extends PartialType(CreateTransactionRequestDTO) {}