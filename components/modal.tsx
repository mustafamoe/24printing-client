import React from "react";
import ClearIcon from "@material-ui/icons/Clear";

interface IProps {
    children?: React.ReactNode;
    close: any;
    style?: any;
}

const ModelBlueprint = ({ children, close, style }: IProps) => {
    return (
        <div className="model-blueprint-container">
            <div style={style || null} className="model-blueprint-wrapper">
                <div className="close-model-btn-container">
                    <button
                        type="button"
                        className="close-model-btn"
                        onClick={close}
                    >
                        <ClearIcon className="close-model-icon" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

export default ModelBlueprint;
