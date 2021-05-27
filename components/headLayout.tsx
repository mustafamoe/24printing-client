import Head from "next/head";

interface IProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
    children?: React.ReactNode;
}

const HeadLayout = ({ title, description, image, children }: IProps) => {
    return (
        <Head>
            <meta property="og:type" content="website" />
            {title && (
                <>
                    <title>{title} | 24printing L.L.C</title>
                    <meta name="title" content={`${title} L.L.C`} />
                    <meta property="og:title" content={`${title} L.L.C`} />
                    <meta property="twitter:title" content={`${title} L.L.C`} />
                </>
            )}
            {description && (
                <>
                    <meta name="description" content={description} />
                    <meta property="og:description" content={description} />
                    <meta property="twitter:image" content={description} />
                </>
            )}
            {image && (
                <>
                    <meta property="og:image" content={image} />
                    <meta property="twitter:image" content={image} />
                    <meta property="twitter:card" content={image} />
                </>
            )}
            {children}
        </Head>
    );
};

export default HeadLayout;
