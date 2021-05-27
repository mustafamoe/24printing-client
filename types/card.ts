import { IImage } from "./image";

interface ICardCusPrice {
    card_cust_id: string;
    price: number;
    quantity_id: string;
}

export interface ICard {
    card_id: string;
    prices: ICardCusPrice[];
    image: IImage;
    title: string;
}
