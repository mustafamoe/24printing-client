interface IDiscountQtys {
    dis_qty_id: string;
    price: number;
    quantity_id: string;
}

export interface IDiscount {
    discount_id: string;
    duration: Date;
    quantities: IDiscountQtys[];
}
