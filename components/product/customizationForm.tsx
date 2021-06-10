import {
    createStyles,
    makeStyles,
    Theme,
    Typography,
    Popover,
} from "@material-ui/core";
import { IDropdown } from "../../types/dropdown";
import { IProduct } from "../../types/product";
import ImageOpt from "../imageOpt";
import { useState } from "react";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: "100%",
            display: "grid",
            gridGap: "20px",
            gridTemplateColumns: (props: any) => {
                let value: any;

                if (props.size === "small") value = "50px, 50px";
                else if (props.size === "medium") value = "100px, 100px";
                else if (props.size === "large") value = "200px, 200px";

                return `repeat( auto-fit, minmax(${value}) )`;
            },
        },
        card: {
            display: "flex",
            alignItems: "center",
            justifyContenr: "center",
            flexDirection: "column",
            boxShadow: theme.shadows[10],
            borderRadius: "5px",
            overflow: "hidden",
        },
        imgContainer: {
            position: "relative",
            width: (props: any) => {
                if (props.size === "small") return "50px";
                else if (props.size === "medium") return "100px";
                else if (props.size === "large") return "200px";
            },
            height: (props: any) => {
                if (props.size === "small") return "50px";
                else if (props.size === "medium") return "100px";
                else if (props.size === "large") return "200px";
            },
        },
        popover: {
            pointerEvents: "none",
        },
        paper: {
            padding: theme.spacing(1),
        },
    })
);

interface IProps {
    product: IProduct;
    state: any;
    setState: any;
    errors: any;
    toggleDesigner: any;
    isDesigner: boolean;
}

const ProductCustomizationForm = ({
    product,
    state,
    setState,
    errors,
    toggleDesigner,
    isDesigner,
}: IProps) => {
    const handleCardOption = (card, id) => {
        const customizationsCopy = [...state.customizations];
        const selectedCustomization = customizationsCopy.find(
            (cus) => cus.customization_id === id
        );
        selectedCustomization.card = card;

        setState({ ...state, customizations: customizationsCopy });
    };

    const handleDropDownOption = (dropdown: IDropdown, id) => {
        const customizationsCopy = [...state.customizations];
        const selectedCustomization = customizationsCopy.find(
            (cus) => cus.customization_id === id
        );

        if (selectedCustomization) {
            selectedCustomization.dropdown = dropdown;

            setState({ ...state, customizations: customizationsCopy });
        }
    };

    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const dropDownValue = (id) => {
        const stateCustomization = state.customizations.find(
            (c) => c.customization_id === id
        );
        if (stateCustomization) return stateCustomization.dropdown?.dropdown_id;
        return "";
    };

    const activeStyles = (card, id) => {
        const stateCustomization = state.customizations.find(
            (c) => c.customization_id === id
        );
        let stateCardOption;
        if (stateCustomization) {
            stateCardOption = stateCustomization.card;
        }
        if (stateCardOption) {
            if (stateCardOption.card_id === card.card_id)
                return {
                    transform: "scale(1.03)",
                    boxShadow:
                        "0px 6px 6px -3px rgb(236 0 140 / 20%), 0px 10px 14px 1px rgb(236 0 140 / 14%), 0px 4px 18px 3px rgb(236 0 140 / 12%)",
                };
        }
    };

    const errorMsg = (fieldName) => {
        if (errors) {
            if (errors[fieldName])
                return (
                    <div className="error-message-container">
                        <p className="error-message-text">
                            {errors[fieldName]}
                        </p>
                    </div>
                );
        }
    };

    const dropDownCustomizationJsx = (dropdown: IDropdown[], name, id) => {
        return (
            <div key={id} className="form-input-container">
                <label
                    className="form-label customizations-heading"
                    htmlFor="addReq"
                >
                    {name}
                </label>
                <select
                    className="form-input product-details-customization-input"
                    value={dropDownValue(id)}
                    onChange={(e) =>
                        handleDropDownOption(
                            dropdown.find(
                                (d) => d.dropdown_id === e.target.value
                            ),
                            id
                        )
                    }
                >
                    <option disabled value="">
                        please choose an option
                    </option>
                    {dropdown.map((dp) => (
                        <option key={dp.dropdown_id} value={dp.dropdown_id}>
                            {dp.title}
                        </option>
                    ))}
                </select>
                {errorMsg(name)}
            </div>
        );
    };

    const cardOptionsJsx = (cards, name, id, size) => {
        const classes = useStyles({ size });

        return (
            <div key={id} className="form-input-container">
                <label
                    className="form-label customizations-heading"
                    htmlFor="addReq"
                >
                    {name}
                </label>
                <div className={classes.root}>
                    {cards.map((card) => {
                        const [anchorEl, setAnchorEl] =
                            useState<HTMLElement | null>(null);

                        const handlePopoverOpen = (
                            event: React.MouseEvent<HTMLElement, MouseEvent>
                        ) => {
                            setAnchorEl(event.currentTarget);
                        };

                        const handlePopoverClose = () => {
                            setAnchorEl(null);
                        };

                        const open = Boolean(anchorEl);

                        return (
                            <div
                                onMouseEnter={handlePopoverOpen}
                                onMouseLeave={handlePopoverClose}
                                style={activeStyles(card, id)}
                                className={classes.card}
                                onClick={() => handleCardOption(card, id)}
                                key={card.card_id}
                            >
                                <div className={classes.imgContainer}>
                                    <ImageOpt
                                        className="product-customization-card-img"
                                        src={card.image?.image_name}
                                        objectFit="contain"
                                        layout="fill"
                                    />
                                </div>
                                <Popover
                                    id="mouse-over-popover"
                                    className={classes.popover}
                                    classes={{
                                        paper: classes.paper,
                                    }}
                                    open={open}
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "center",
                                    }}
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "center",
                                    }}
                                    onClose={handlePopoverClose}
                                    disableRestoreFocus
                                >
                                    <Typography>{card.title}</Typography>
                                </Popover>
                            </div>
                        );
                    })}
                </div>
                {errorMsg(name)}
            </div>
        );
    };

    return (
        <div className="product-customizations-container">
            {product.customizations.map((customization) => {
                if (customization.option) {
                    if (customization.type === "card") {
                        return cardOptionsJsx(
                            customization.cards,
                            customization.option.option_name,
                            customization.customization_id,
                            customization.size
                        );
                    } else if (customization.type === "dropdown") {
                        return dropDownCustomizationJsx(
                            customization.dropdown,
                            customization.option.option_name,
                            customization.customization_id
                        );
                    }
                }
            })}
            {isDesigner && (
                <label style={{ cursor: "pointer" }} onClick={toggleDesigner}>
                    <div className="design-image-container">
                        {!state.designImage ? (
                            <div className="design-container">
                                <ImageOpt
                                    className="graphic-design"
                                    location="local"
                                    src="/graphic-design.svg"
                                    alt="graphic deseign"
                                    width={200}
                                    height={200}
                                />
                                <p className="design-msg">design goes here</p>
                            </div>
                        ) : (
                            <div className="product-details-logo-and-design-container">
                                <div className="product-details-logo-container">
                                    <img
                                        id="logo-image"
                                        src={
                                            state.logo
                                                ? state.logo
                                                : "/placeholder.jpg"
                                        }
                                        alt="user design"
                                    />
                                </div>
                                <div className="product-details-logo-and-design-item">
                                    <img
                                        id="design-image"
                                        src={state.designImage}
                                        alt="user design"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </label>
            )}
            {errorMsg("designImage")}
            <div className="form-input-container customizations-heading">
                <label className="form-label" htmlFor="addReq">
                    additional comments or requests
                </label>
                <textarea
                    data-gramm_editor="false"
                    className="form-input form-textarea"
                    id="addReq"
                    name="additionalRequests"
                    onChange={handleChange}
                    value={state.additionalRequests}
                ></textarea>
            </div>
        </div>
    );
};

export default ProductCustomizationForm;
