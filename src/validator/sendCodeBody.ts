import { IsNotEmpty, Length } from "class-validator"

export class sendCodeBody {
    @IsNotEmpty()
    @Length(5, 10)
    code: string
}
