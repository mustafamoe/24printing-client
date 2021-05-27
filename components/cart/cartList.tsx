// components
import { ICart } from "../../types/cart";
import CartItem from "./cartItem";

interface IProps {
    cart: ICart[];
}

const CartProductList = ({ cart }: IProps) => {
    return (
        <div className="cart-product-list">
            {cart.map((item) => (
                <CartItem key={item.product_id} product={item} />
            ))}
        </div>
    );
};

export default CartProductList;
