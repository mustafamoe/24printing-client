import {
    Box,
    Typography,
    Button,
    createStyles,
    makeStyles,
    Theme,
    Menu,
    MenuItem,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { useState } from "react";
import { IImage } from "../../../types/image";
import useSWR from "swr";

// components
import AdminLayout from "../../../components/admin/adminLayout";
import HeadLayout from "../../../components/headLayout";
import ImageList from "../../../components/admin/gallery/imageList";
import ImageForm from "../../../components/admin/gallery/imageForm";

// icons
import SortIcon from "@material-ui/icons/Sort";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        head: {
            backgroundColor: "white",
            padding: "10px 0",
            position: "sticky",
            zIndex: 3,
            top: 0,
        },
    })
);

type Sort = "Latest" | "Oldest";

const sortOptions: Sort[] = ["Latest", "Oldest"];

const Gallery = () => {
    const classes = useStyles();
    const { data: images } = useSWR<IImage[]>("/images");
    const [isAdd, setAdd] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedSort, setSelectedSort] = useState<Sort | null>(null);

    const closeAdd = () => {
        setAdd(false);
    };

    const openAdd = () => {
        setAdd(true);
    };

    const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLElement>,
        value: Sort
    ) => {
        setSelectedSort(value);
        setAnchorEl(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <HeadLayout title="Admin Gallery" />
            <AdminLayout access="is_admin">
                <div style={{ width: "100%" }}>
                    <Box display="flex" flexDirection="column">
                        <Box
                            className={classes.head}
                            display="flex"
                            flexDirection="row"
                        >
                            <Box flexGrow={1} style={{ marginBottom: "30px" }}>
                                <Typography variant="h5">Gallery</Typography>
                            </Box>
                            <Box display="flex" alignItems="center">
                                <Box mr={2}>
                                    <Button
                                        startIcon={<SortIcon />}
                                        variant="outlined"
                                        onClick={handleClickListItem}
                                    >
                                        Sort
                                    </Button>
                                </Box>
                                <Menu
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "center",
                                    }}
                                    transformOrigin={{
                                        vertical: "bottom",
                                        horizontal: "center",
                                    }}
                                    onClose={handleClose}
                                >
                                    {sortOptions.map((sort) => (
                                        <MenuItem
                                            key={sort}
                                            selected={sort === selectedSort}
                                            onClick={(event) =>
                                                handleMenuItemClick(event, sort)
                                            }
                                        >
                                            {sort}
                                        </MenuItem>
                                    ))}
                                </Menu>
                                <Button
                                    startIcon={<Add />}
                                    variant="contained"
                                    type="button"
                                    onClick={openAdd}
                                    color="primary"
                                >
                                    add images
                                </Button>
                            </Box>
                        </Box>
                        <div>
                            <ImageList
                                images={images}
                                sortOption={selectedSort}
                            />
                        </div>
                    </Box>
                </div>
                {isAdd && <ImageForm close={closeAdd} />}
            </AdminLayout>
        </>
    );
};

export default Gallery;
