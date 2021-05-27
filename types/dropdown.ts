interface IDropdownCusPrice {
    dropdown_cust_id: string;
    price: number;
    quantity_id: string;
}

export interface IDropdown {
    dropdown_id: string;
    prices: IDropdownCusPrice[];
    title: string;
}
