import { useSelector } from "react-redux";
import useSwr from "swr";
import { RootReducer } from "../store/reducers";
import { IProduct } from "../types/product";
import { ICart } from "../types/cart";

const useCart = (): [ICart[], boolean] => {
    const { data: products } = useSwr<IProduct[]>("/products");
    const { cart } = useSelector((state: RootReducer) => state);

    if (cart.length && products && products.length) {
        const cartCopy = [...cart];
        let newCart = [];
        cartCopy.forEach((item) => {
            let itemCopy: any = { ...item };

            const foundProduct = products.find(
                (pro) => pro.product_id === itemCopy.product_id
            );

            if (foundProduct) {
                const foundQuantity = foundProduct.quantities.find(
                    (q) => q.quantity_id === itemCopy.quantity
                );

                let populateCustomizations = [];
                itemCopy.customizations.forEach((c) => {
                    const foundCustomization = foundProduct.customizations.find(
                        (cust) => cust.customization_id === c.customization_id
                    );

                    if (foundCustomization) {
                        if (foundCustomization.type === "dropdown") {
                            const foundDropDown =
                                foundCustomization.dropdown.find(
                                    (d) =>
                                        String(d.dropdown_id) ===
                                        String(c.dropdown)
                                );

                            return populateCustomizations.push({
                                ...c,
                                name: foundCustomization.option.option_name,
                                dropdown: foundDropDown,
                            });
                        } else if (foundCustomization.type === "card") {
                            const foundCardOption =
                                foundCustomization.cards.find(
                                    (d) => String(d.card_id) === String(c.card)
                                );
                            return populateCustomizations.push({
                                ...c,
                                name: foundCustomization.option.option_name,
                                card: foundCardOption,
                            });
                        }
                        return populateCustomizations.push(c);
                    }
                });

                itemCopy.customizations = populateCustomizations;
                itemCopy.quantity = foundQuantity;
                itemCopy.product = foundProduct;

                newCart.push(itemCopy);
            }
        });

        return [newCart, !products ? true : false];
    }

    return [[], !products ? true : false];
};

export default useCart;
