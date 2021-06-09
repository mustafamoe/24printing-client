import { useState, useEffect } from "react";
import { fabric } from "fabric";
import html2canvas from "html2canvas";
import { SketchPicker } from "react-color";
import {
    Box,
    IconButton,
    Button,
    Divider,
    AppBar,
    Toolbar,
    TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// components
import ImageOpt from "../imageOpt";
import ActionModal from "../admin/actionModal";

// icons
import ClearIcon from "@material-ui/icons/Clear";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import { IDesigner } from "../../types/designer";

const useStyles = makeStyles({
    root: {
        position: "fixed",
        top: "0",
        zIndex: 1000,
        left: "0",
        width: "100%",
        height: "100vh",
        backgroundColor: "white",
    },
    appbar: {
        height: "70px",
    },
    toolbar: {
        display: "flex",
        justifyContent: "space-between",
        height: "100%",
    },
    toolbox: {
        userSelect: "none",
        padding: "5px 10px",
        borderRadius: "5px",
        backgroundColor: "white",
        display: "flex",
        alignItems: "center",
    },
    sizeInput: {
        fontSize: "6px",
        width: "100px",
        margin: "0",
    },
    divider: {
        backgroundColor: "rgb(139, 139, 139)",
        margin: "0 15px 0 15px",
    },
    square: {
        backgroundColor: "rgb(59, 59, 59)",
        width: "25px",
        height: "25px",
    },
    circle: {
        backgroundColor: "rgb(59, 59, 59)",
        width: "25px",
        height: "25px",
        borderRadius: "50%",
    },
    colorPickerContainer: {
        position: "relative",
    },
    colorPicker: {
        position: "absolute",
        top: "100%",
        right: 0,
    },
    trashIcon: {
        filter: "invert(36%) sepia(98%) saturate(7256%) hue-rotate(355deg) brightness(105%) contrast(122%)",
    },
    saveButton: {
        borderColor: "white",
        color: "white",
    },
    sidebar: {
        width: "300px",
        minWidth: "300px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "10px",
        overflowY: "auto",
    },
    sidebarImgContainer: {
        height: "260px",
        width: "260px",
        minHeight: "260px",
        minWidth: "260px",
        position: "relative",
        marginBottom: "10px",
        userSelect: "none",
    },
    stage: {
        width: "100%",
        height: "100%",
        display: "flex",
        overflow: "auto",
        padding: "50px",
    },
    canvasContainer: {
        width: "500px",
        height: "500px",
        minWidth: "500px",
        minHeight: "500px",
        position: "relative",
        margin: "auto",
        borderRadius: "10px",
        overflow: "hidden",
        userSelect: "none",
        boxShadow:
            "rgb(0 0 0 / 20%) 0px 3px 3px -2px, rgb(0 0 0 / 14%) 0px 3px 4px 0px, rgb(0 0 0 / 12%) 0px 1px 8px 0px",
    },
    activeImgContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: -1,
        width: "100%",
        height: "100%",
    },
    activeOverlayContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 2,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
    },
    canvas: {
        zIndex: 2,
        width: "500px",
        height: "500px",
    },
});

interface IProps {
    images: IDesigner[];
    close: any;
    handleSaveDesign: any;
}

const Designer = ({ images, close, handleSaveDesign }: IProps) => {
    const [logo, setLogo] = useState<any>(null);
    const [canvas, setCanvas] = useState(null);
    const [design, setDesign] = useState<IDesigner | null>(null);
    const [isSave, setSave] = useState(false);
    const classes = useStyles();
    const [isClose, setClose] = useState(false);
    const [state, setState] = useState({
        color: {
            r: "f",
            g: "f",
            b: "f",
            a: "e",
        },
        showColorPicker: false,
        fontSize: 40,
    });

    // ------------------------------- default design
    useEffect(() => {
        const design = images[0];

        if (design) setDesign(design);
    }, []);

    // ------------------------------ canvas
    const initCanvas = () => {
        const canvas = new fabric.Canvas("canvas");

        fabric.Object.prototype.set({
            transparentCorners: false,
            borderDashArray: [4, 4],
            borderColor: "rgb(120, 120, 120)",
            cornerStrokeColor: "rgb(236, 0, 140)",
            cornerColor: "white",
        });

        canvas.setWidth(500);
        canvas.setHeight(500);
        canvas.renderAll();

        return canvas;
    };

    useEffect(() => {
        setCanvas(initCanvas());
    }, []);

    const addImageToCanvas = (can, data, id) => {
        const image = document.createElement("img");
        image.src = data;
        image.id = id;

        const logoImg = canvas
            .getObjects()
            .find((obj) => (obj._element ? obj._element.id === id : false));
        if (logoImg) canvas.remove(logoImg);

        setTimeout(() => {
            const img = new fabric.Image(image, {
                borderOpacityWhenMoving: 1,
            });

            img.setControlsVisibility({
                mb: false,
                mt: false,
                ml: false,
                mr: false,
            });

            can.add(img);
            can.renderAll();
        }, 1);
    };

    const handleChangeFontSize = (e) => {
        const num = Number(e.target.value);
        if (num > -1 && num <= 120) {
            setState({ ...state, fontSize: num });
        }
    };

    // ----------------------------- logo upload
    const handleImageUpload = (e) => {
        if (e.target.files.length) {
            const reader = new FileReader();

            reader.onload = () => {
                const data = reader.result;

                setLogo(data);
                addImageToCanvas(canvas, data, "logo");
            };

            reader.readAsDataURL(e.target.files[0]);
        }
    };

    // ------------------------- canvas actions
    useEffect(() => {
        if (canvas) {
            const color = `rgba(${state.color.r}, ${state.color.g}, ${state.color.b}, ${state.color.a})`;
            const group = canvas.getActiveObjects();
            if (group) {
                if (state.color) {
                    group.forEach((obj) => {
                        obj.fillColor = color;
                        obj.set("fill", color);
                    });
                }

                return canvas.renderAll();
            }
        }
    }, [state.color]);

    useEffect(() => {
        if (canvas) {
            const group = canvas.getActiveObjects();
            if (group) {
                if (state.fontSize) {
                    group.forEach((obj) => {
                        obj.fontSize = state.fontSize;
                        obj.set("fontSize", state.fontSize);
                    });
                }

                return canvas.renderAll();
            }
        }
    }, [state.fontSize]);

    const handleRemove = () => {
        const activeObject = canvas.getActiveObject();
        const group = canvas.getActiveObjects();
        if (group) {
            canvas.discardActiveObject();
            canvas.remove(...group);
        }
        if (activeObject) canvas.remove(activeObject);
    };

    const handleLayring = (place) => {
        const group = canvas.getActiveObjects();
        if (group) {
            group.forEach((obj) => {
                switch (place) {
                    case "front":
                        canvas.bringToFront(obj);
                        canvas.discardActiveObject(obj);
                        return canvas.renderAll();
                    case "back":
                        canvas.sendToBack(obj);
                        canvas.discardActiveObject(obj);
                        return canvas.renderAll();
                    default:
                        return;
                }
            });
        }
    };

    const handleAddText = () => {
        const text = new fabric.Textbox("some text");
        text.fontSize = state.fontSize;
        text.set("fontSize", state.fontSize);
        text.setControlsVisibility({ mb: false, mt: false });

        canvas.add(text);
    };

    const handleAddShape = (shapeType) => {
        let options: any;

        if (shapeType === "Polygon") {
            (options = [
                { x: 200, y: 0 },
                { x: 250, y: 50 },
                { x: 250, y: 100 },
                { x: 150, y: 100 },
                { x: 150, y: 50 },
            ]),
                {
                    left: 250,
                    top: 0,
                    angle: 0,
                    fill: "black",
                };
        } else
            options = {
                width: 100,
                height: 100,
                fillColor: "black",
                radius: 100,
            };

        const shape = new fabric[shapeType](options);

        canvas.add(shape);
        canvas.renderAll();
    };

    // -------------------- close modal
    const handleOpenClose = () => {
        setClose(true);
    };

    const handleCloseClose = () => {
        setClose(false);
    };

    // -------------------- color picker
    useEffect(() => {
        if (state.showColorPicker) {
            const eventHandler = () => {
                setState({ ...state, showColorPicker: false });

                document.body.removeEventListener("click", eventHandler);
            };

            document.body.addEventListener("click", eventHandler);
        }
    }, [state.showColorPicker]);

    const handleChangeColor = (color) => {
        setState({ ...state, color: color.rgb });
    };

    const toggleColorPicker = (e) => {
        setState({ ...state, showColorPicker: !state.showColorPicker });
        e.stopPropagation();
    };

    // ------------------------ save
    const handleOpenSave = () => {
        setSave(true);
    };

    const handleCloseSave = () => {
        setSave(false);
    };

    const handleSave = async () => {
        canvas.discardActiveObject().renderAll();

        const node: any = document.getElementById("screenshot");
        const des: any = document.getElementById("des");

        const desDomRect: any = des.getBoundingClientRect();

        const screenshot = await html2canvas(node, {
            useCORS: true,
            scale: 2,
            allowTaint: false,
            width: 500,
            height: 500,
            scrollY: desDomRect.y,
            scrollX: desDomRect.x,
            windowHeight: window.innerHeight,
            windowWidth: window.innerWidth,
        });

        const dataUrl = screenshot.toDataURL();

        var img = new Image();
        img.src = dataUrl;

        handleCloseSave();
        handleSaveDesign(dataUrl, logo);
    };

    // ------------------------------ select design
    const handleSetDesign = (id) => {
        setDesign(images.find((i) => i.designer_id === id));
    };

    return (
        <>
            <Box id="des" className={classes.root}>
                <AppBar position="fixed" classes={{ root: classes.appbar }}>
                    <Toolbar classes={{ root: classes.toolbar }}>
                        <Box display="flex">
                            <Box mr={2}>
                                <label htmlFor="logo">
                                    <Button
                                        variant="contained"
                                        component="span"
                                        color="secondary"
                                    >
                                        Upload logo
                                    </Button>
                                    <input
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        id="logo"
                                        type="file"
                                        onChange={handleImageUpload}
                                    />
                                </label>
                            </Box>
                            <Box>
                                <Button
                                    variant="outlined"
                                    classes={{ root: classes.saveButton }}
                                    onClick={handleOpenSave}
                                >
                                    save and exit
                                </Button>
                            </Box>
                        </Box>
                        <Box boxShadow={3} className={classes.toolbox}>
                            <Box onClick={handleAddText}>
                                <ImageOpt
                                    width={20}
                                    height={20}
                                    src="/text.svg"
                                    location="local"
                                />
                            </Box>
                            <Divider
                                classes={{ root: classes.divider }}
                                orientation="vertical"
                                flexItem
                            />
                            <Box display="flex" alignItems="center">
                                <TextField
                                    type="number"
                                    variant="outlined"
                                    size="small"
                                    classes={{ root: classes.sizeInput }}
                                    value={state.fontSize}
                                    onChange={handleChangeFontSize}
                                />
                                <Box ml={2}>
                                    <ImageOpt
                                        className="font-size-icon"
                                        src="/font.svg"
                                        alt="font size"
                                        width={25}
                                        location="local"
                                        height={25}
                                    />
                                </Box>
                            </Box>
                            <Divider
                                classes={{ root: classes.divider }}
                                orientation="vertical"
                                flexItem
                            />
                            <Box>
                                <Box
                                    className={classes.square}
                                    onClick={() => handleAddShape("Rect")}
                                ></Box>
                            </Box>
                            <Divider
                                classes={{ root: classes.divider }}
                                orientation="vertical"
                                flexItem
                            />
                            <Box>
                                <Box
                                    className={classes.circle}
                                    onClick={() => handleAddShape("Circle")}
                                ></Box>
                            </Box>
                            <Divider
                                classes={{ root: classes.divider }}
                                orientation="vertical"
                                flexItem
                            />
                            <Box onClick={() => handleLayring("front")}>
                                <ImageOpt
                                    width={30}
                                    height={30}
                                    src="/bring-to-front.svg"
                                    location="local"
                                />
                            </Box>
                            <Divider
                                classes={{ root: classes.divider }}
                                orientation="vertical"
                                flexItem
                            />
                            <Box onClick={() => handleLayring("back")}>
                                <ImageOpt
                                    width={30}
                                    height={30}
                                    src="/backward.svg"
                                    location="local"
                                />
                            </Box>
                            <Divider
                                classes={{ root: classes.divider }}
                                orientation="vertical"
                                flexItem
                            />
                            <Box className={classes.colorPickerContainer}>
                                <div onClick={toggleColorPicker}>
                                    <ImageOpt
                                        width={30}
                                        height={30}
                                        src="/color-picker.svg"
                                        location="local"
                                    />
                                </div>
                                {state.showColorPicker ? (
                                    <Box
                                        onClick={(e) => e.stopPropagation()}
                                        className={classes.colorPicker}
                                    >
                                        <SketchPicker
                                            color={state.color}
                                            onChange={handleChangeColor}
                                        />
                                    </Box>
                                ) : null}
                            </Box>
                            <Divider
                                classes={{ root: classes.divider }}
                                orientation="vertical"
                                flexItem
                            />
                            <Box
                                onClick={handleRemove}
                                className={classes.trashIcon}
                            >
                                <ImageOpt
                                    width={30}
                                    height={30}
                                    src="/trash (1).svg"
                                    location="local"
                                />
                            </Box>
                        </Box>
                        <IconButton
                            onClick={handleOpenClose}
                            edge="end"
                            color="inherit"
                        >
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Box display="flex" height="calc(100vh - 70px)" mt="70px">
                    <Box className={classes.sidebar} boxShadow={3}>
                        {images.map((d) => (
                            <Box
                                className={classes.sidebarImgContainer}
                                key={d.designer_id}
                                onClick={() => handleSetDesign(d.designer_id)}
                            >
                                <ImageOpt
                                    src={d.image.image_name}
                                    layout="fill"
                                    objectFit="contain"
                                />
                            </Box>
                        ))}
                    </Box>
                    <Box className={classes.stage}>
                        <div
                            id="screenshot"
                            className={classes.canvasContainer}
                        >
                            <canvas id="canvas" className={classes.canvas} />
                            {design && (
                                <>
                                    <Box className={classes.activeImgContainer}>
                                        <ImageOpt
                                            src={design.image.image_name}
                                            draggable={false}
                                            layout="fill"
                                            objectFit="contain"
                                        />
                                    </Box>
                                    <Box
                                        className={
                                            classes.activeOverlayContainer
                                        }
                                        width={500}
                                        height={500}
                                    >
                                        <ImageOpt
                                            draggable={false}
                                            src={design.overlay.image_name}
                                            layout="fill"
                                            objectFit="contain"
                                        />
                                    </Box>
                                </>
                            )}
                        </div>
                    </Box>
                </Box>
            </Box>
            {isClose && (
                <ActionModal
                    close={handleCloseClose}
                    title="Close product designer"
                    msg={`Are you sure you want to close designer?`}
                    handler={() => {
                        close();
                        handleCloseClose();
                    }}
                    loading={false}
                    btnTxt="close"
                    btnIcon={<ClearIcon />}
                />
            )}
            {isSave && (
                <ActionModal
                    close={handleCloseSave}
                    title="Save design"
                    msg={`Are you sure you want to save design?`}
                    handler={() => {
                        handleSave();
                    }}
                    loading={false}
                    btnTxt="save"
                    type="confirmation"
                    btnIcon={<CheckIcon />}
                />
            )}
        </>
    );
};

export default Designer;
