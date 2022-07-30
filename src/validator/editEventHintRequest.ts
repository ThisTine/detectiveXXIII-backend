import { IsNotEmpty } from "class-validator"

export class EditEventHintBody {
    @IsNotEmpty()
    id: string
    @IsNotEmpty()
    location: string
}
