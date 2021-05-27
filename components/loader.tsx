interface IProps {
    style?: any;
    button?: any;
    size?: any;
}

const Loader = ({ style, button, size }: IProps) => {
    return (
        <div
            className="loader-container"
            style={button ? { width: "auto", margin: "0 10px" } : null}
        >
            <div
                style={
                    size
                        ? { width: `${size}px`, height: `${size}px` }
                        : style
                        ? style
                        : null
                }
                className="loader"
            ></div>
        </div>
    );
};

export default Loader;
