import { ADD_PRODUCTS, CLEAR_PRODUCTS } from "../actionTypes";
import { CheckoutState, CheckoutActionTypes } from "../types/checkout";

const INITIAL_STATE: CheckoutState = [];

const checkoutReducer = (
    state = INITIAL_STATE,
    action: CheckoutActionTypes
) => {
    switch (action.type) {
        case ADD_PRODUCTS:
            const tmpState = [];

            for (let p of action.order.products) {
                tmpState.push({
                    product_id: p.product_id,
                    customizations: p.customizations.map((c) => {
                        if (c.type === "cards")
                            return {
                                customization_id: c.customization_id,
                                type: c.type,
                                card: c.card.card_id,
                            };
                        else if (c.type === "dropdown")
                            return {
                                customization_id: c.customization_id,
                                type: c.type,
                                dropdown: c.dropdown.dropdown_id,
                            };
                    }),
                    designImage: p.designImage,
                    logo: p.logo,
                    quantity: p.quantity.quantity_id,
                    additionalRequests: p.additionalRequests,
                });
            }

            console.log(tmpState, "ESELJLSDFJLSDJFKJ");

            return tmpState;
        case CLEAR_PRODUCTS:
            return [];
        default:
            return state;
    }
};

export default checkoutReducer;
