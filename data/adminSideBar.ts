interface IModel {
    icon?: string;
    text?: string;
    link?: string;
    divider?: boolean;
    access?: string;
}

export const tabsList: IModel[] = [
    {
        access: "is_accountant",
        icon: "/order.png",
        text: "Orders",
        link: "/admin/orders",
    },
    {
        icon: "/gallery.png",
        text: "Gallery",
        link: "/admin/gallery",
    },
    {
        icon: "/category.png",
        text: "Categories",
        link: "/admin/categories",
    },
    {
        icon: "/subCategory.png",
        text: "Sub categories",
        link: "/admin/subCategories",
    },
    {
        icon: "/product.png",
        text: "Products",
        link: "/admin/products",
    },
    {
        icon: "/options.png",
        text: "Customize Options",
        link: "/admin/options",
    },
    { divider: true },
    {
        icon: "/banner.png",
        text: "Banners",
        link: "/admin/banners",
    },
    {
        icon: "/advCards.png",
        text: "Adv cards",
        link: "/admin/advCards",
    },
    {
        icon: "/advPopup.png",
        text: "Adv popup",
        link: "/admin/advPopup",
    },
    { divider: true },
    {
        icon: "/users.png",
        text: "Users",
        link: "/admin/users",
    },
    {
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
