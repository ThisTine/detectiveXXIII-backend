import { IsNotEmpty } from "class-validator"

export class CreateEventHintBody {
    @IsNotEmpty()
    location: string
}
