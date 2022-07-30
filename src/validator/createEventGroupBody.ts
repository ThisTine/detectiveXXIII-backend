import { IsNotEmpty, ValidateNested } from "class-validator"

export class WithId {
    @IsNotEmpty()
    id: string
}

export class CreateEventGroupBody {
    @ValidateNested({ each: true })
    hints: WithId[]
}
