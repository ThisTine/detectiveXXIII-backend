import { ArrayMaxSize, ArrayMinSize } from "class-validator"

export class SendHints {
    @ArrayMinSize(10)
    @ArrayMaxSize(10)
    hints: string[]
}
