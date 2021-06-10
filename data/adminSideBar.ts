import { Access } from "../types/user";

interface IModel {
    icon?: string;
    text?: string;
    link?: string;
    divider?: boolean;
    access?: Access;
}

export const tabsList: IModel[] = [
    {
        access: "is_accountant",
        icon: "/order.png",
        text: "Orders",
        link: "/admin/orders",
    },
    {
        access: "is_admin",
        icon: "/gallery.png",
        text: "Gallery",
        link: "/admin/gallery",
    },
    {
        access: "is_admin",
        icon: "/category.png",
        text: "Categories",
        link: "/admin/categories",
    },
    {
        access: "is_admin",
        icon: "/subCategory.png",
        text: "Sub categories",
        link: "/admin/subCategories",
    },
    {
        access: "is_admin",
        icon: "/product.png",
        text: "Products",
        link: "/admin/products",
    },
    {
        access: "is_admin",
        icon: "/options.png",
        text: "Customize Options",
        link: "/admin/options",
        divider: true,
    },
    {
        access: "is_admin",
        icon: "/banner.png",
        text: "Banners",
        link: "/admin/banners",
    },
    {
        access: "is_admin",
        icon: "/advCards.png",
        text: "Adv cards",
        link: "/admin/advCards",
    },
    {
        access: "is_admin",
        icon: "/advPopup.png",
        text: "Adv popup",
        link: "/admin/advPopup",
        divider: true,
    },
    {
        access: "is_super_admin",
        icon: "/users.png",
        text: "Users",
        link: "/admin/users",
    },
    {
        access: "is_admin",
        icon: "/privacyPolicy.png",
        text: "Privacy policy",
        link: "/admin/privacyPolicy",
    },
    {
        access: "is_customer_service",
        icon: "/chat.png",
        text: "Chat",
        link: "/admin/chat",
    },
];
