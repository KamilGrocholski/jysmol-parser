import { JysmolParser } from "./parser";
import { JysmolStringifier } from "./stringifier";

export const Jysmol = {
    parse: JysmolParser.parse,
    stringify: JysmolStringifier.stringify
}
