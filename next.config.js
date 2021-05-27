module.exports = {
    images: {
        domains: ["localhost", "res.cloudinary.com"],
    },
    future: {
        webpack5: true,
    },
    env: {
        STRIPE_PK: process.env.NEXT_PUBLIC_STRIPE_PK,
    },
};
