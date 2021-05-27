import Image from "next/image";
import { apiImage } from "../utils/apiCall";
import { useState, useRef, useEffect } from "react";

interface IProps {
    src: string;
    alt?: string;
    className?: string;
    layout?: "fixed" | "intrinsic" | "responsive" | "fill" | undefined;
    objectFit?: NonNullable<JSX.IntrinsicElements["img"]["style"]>["objectFit"];
    width?: number;
    location?: "cloudinary" | "local";
    height?: number;
    draggable?: boolean;
}

const ImageOpt = ({
    src,
    layout,
    objectFit,
    alt,
    width,
    height,
    className,
    location,
}: IProps) => {
    const [q, setQ] = useState<number | undefined>(1);
    const ref = useRef<any>();
    const [steps, setSteps] = useState(0);
    const [isStyle, setStyle] = useState(true);
    const timer = useRef<any>(null);

    useEffect(() => {
        timer.current = setTimeout(() => {
            if (steps === 1) {
                setQ(undefined);
                setSteps(() => steps + 1);

                return;
            }
        }, 10);

        if (steps === 2) {
            clearInterval(timer.current);
        }
    }, [steps]);

    const onLoad = () => {
        if (steps === 1) {
            setQ(undefined);
            setSteps(() => steps + 1);

            return;
        }

        if (steps === 2) {
            setStyle(false);

            return;
        }

        setSteps(steps + 1);
    };

    return (
        <div
            className="imageContainer"
            style={
                (isStyle || q) && location != "local"
                    ? { filter: "blur(10px)" }
                    : undefined
            }
            ref={ref}
        >
            <Image
                onLoad={onLoad}
                className={className}
                width={width || null}
                height={height || null}
                alt={alt}
                layout={!width ? (layout as any) : null}
                objectFit={!width ? objectFit : null}
                src={
                    location === "local"
                        ? src
                        : apiImage(src, ref.current?.clientWidth, q)
                }
            />
            <style jsx>{`
                .imageContainer {
                    height: ${!height ? "100%" : `${height}px`};
                    width: ${!width ? "100%" : `${width}px`};
                    transition: all 1s ease;
                }
            `}</style>
        </div>
    );
};

export default ImageOpt;
