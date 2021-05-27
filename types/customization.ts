import { ICard } from "./card";
import { IDropdown } from "./dropdown";
import { IOption } from "./option";

export interface ICustomization {
    customization_id: string;
    option: IOption;
    type: "card" | "dropdown" | null;
    cards?: ICard[];
    dropdown?: IDropdown[];
}
