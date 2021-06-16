import dateFormat from "dateformat";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { useState } from "react";
import { Button, Menu, MenuItem } from "@material-ui/core";
import useSWR from "swr";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import {
    TablePagination,
    AccordionSummary,
    Accordion,
    AccordionDetails,
    Typography,
    Box,
} from "@material-ui/core";
import { ISubCategory } from "../../../types/subCategory";
import { mutate } from "swr";
import { apiCall } from "../../../utils/apiCall";
import { useSelector } from "react-redux";
import { RootReducer } from "../../../store/reducers";

// components
import SubCategoryForm from "./subCategoryForm";
import ActionModal from "../actionModal";

// icons
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            "&:hover": {
                boxShadow:
                    "0px 0px 5px 1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
                backgroundColor: "rgb(245, 245, 245)",
            },
        },
        table: {
            minWidth: 650,
        },
        tableCell: {
            maxWidth: "200px",
            whiteSpace: "nowrap",
            overflowX: "hidden",
            textOverflow: "ellipsis",
        },
        sticky: {
            zIndex: 1,
        },
        stickyHover: {
            zIndex: 1,
            right: "0",
            position: "sticky",
        },
        heading: {
            fontSize: theme.typography.pxToRem(20),
            textAlign: "center",
            width: "100%",
        },
    })
);

const SubCategoryItem = ({ subCategory, handleOpenDel, handleOpenEdit }) => {
    const classes = useStyles();
    const [isHover, setHover] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const delAction = () => {
        handleOpenDel(subCategory);
        handleClose();
    };

    const handleMouseOver = () => {
        setHover(true);
    };

    const handleMouseLeave = () => {
        setHover(false);
    };

    const handleEdit = () => {
        handleClose();
        handleOpenEdit(subCategory);
    };

    return (
        <TableRow
            classes={{ root: classes.root }}
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}
            key={subCategory.sub_category_id}
        >
            <TableCell
                classes={{
                    root: classes.tableCell,
                }}
            >
                {subCategory.sub_category_name}
            </TableCell>
            <TableCell
                classes={{
                    root: classes.tableCell,
                }}
            >
                {subCategory.sub_category_order}
            </TableCell>
            <TableCell
                classes={{
                    root: classes.tableCell,
                }}
            >
                {subCategory.is_hidden ? (
                    <CheckIcon color="primary" />
                ) : (
                    <ClearIcon color="secondary" />
                )}
            </TableCell>
            <TableCell
                style={{
                    whiteSpace: "nowrap",
                }}
            >
                {dateFormat(
                    subCategory.created_at,
                    "dddd, mmmm dS, yyyy, h:MM:ss TT"
                )}
            </TableCell>
            <TableCell
                style={{
                    whiteSpace: "nowrap",
                }}
            >
                {subCategory?.created_by.username || (
                    <Typography align="center">-</Typography>
                )}
            </TableCell>
            <TableCell
                style={{
                    whiteSpace: "nowrap",
                }}
            >
                {dateFormat(
                    subCategory.updated_at,
                    "dddd, mmmm dS, yyyy, h:MM:ss TT"
                )}
            </TableCell>
            <TableCell
                style={{
                    whiteSpace: "nowrap",
                }}
            >
                {subCategory.updated_by.username || (
                    <Typography align="center">-</Typography>
                )}
            </TableCell>
            <TableCell
                classes={{
                    root: isHover ? classes.stickyHover : classes.sticky,
                }}
            >
                <Box width={45}>
                    <Button
                        style={{ minWidth: "100%" }}
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        size="small"
                        variant="contained"
                        color="secondary"
                        onClick={handleClick}
                    >
                        <MoreHorizIcon />
                    </Button>
                </Box>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleEdit}>Edit</MenuItem>
                    <MenuItem onClick={delAction}>Delete</MenuItem>
                </Menu>
            </TableCell>
        </TableRow>
    );
};

const SubCategoryList = ({ categoryId, subCategories }) => {
    const user = useSelector((state: RootReducer) => state.auth.user);
    const classes = useStyles();
    const [isDel, setDel] = useState<null | ISubCategory>(null);
    const [isEdit, setEdit] = useState<null | ISubCategory>(null);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [delLoading, setDelLoading] = useState(false);
    const [page, setPage] = useState(0);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenDel = (product: ISubCategory) => {
        setDel(product);
    };

    const handleCloseDel = () => {
        setDel(null);
    };

    const handleOpenEdit = (product: ISubCategory) => {
        setEdit(product);
    };

    const handleCloseEdit = () => {
        setEdit(null);
    };

    const handleDelete = async () => {
        try {
            setDelLoading(true);
            await apiCall(
                "delete",
                `/sub_category/${isDel.sub_category_id}?authId=${user.user_id}`
            );

            mutate(
                `/sub_categories?categoryId=${categoryId}`,
                (subCategories: ISubCategory[]) => {
                    return subCategories.filter(
                        (c) => c.sub_category_id !== isDel.sub_category_id
                    );
                },
                false
            );

            setDelLoading(false);
            handleCloseDel();
        } catch (err) {
            setDelLoading(false);
        }
    };

    if (subCategories)
        return (
            <>
                <Box display="flex" flexDirection="column" width="100%">
                    <TableContainer component={Paper}>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        style={{ minWidth: "150px" }}
                                        align="left"
                                    >
                                        Name
                                    </TableCell>
                                    <TableCell
                                        style={{ minWidth: "150px" }}
                                        align="left"
                                    >
                                        Order
                                    </TableCell>
                                    <TableCell
                                        style={{ minWidth: "150px" }}
                                        align="left"
                                    >
                                        Hidden
                                    </TableCell>
                                    <TableCell
                                        style={{ minWidth: "150px" }}
                                        align="left"
                                    >
                                        Created at
                                    </TableCell>
                                    <TableCell
                                        style={{ minWidth: "150px" }}
                                        align="left"
                                    >
                                        Created by
                                    </TableCell>
                                    <TableCell
                                        style={{ minWidth: "150px" }}
                                        align="left"
                                    >
                                        Updated at
                                    </TableCell>
                                    <TableCell
                                        style={{ minWidth: "150px" }}
                                        align="left"
                                    >
                                        Updated by
                                    </TableCell>
                                    <TableCell
                                        style={{ minWidth: "150px" }}
                                        align="left"
                                    >
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {subCategories
                                    .slice(
                                        page * rowsPerPage,
                                        page * rowsPerPage + rowsPerPage
                                    )
                                    .sort(
                                        (a, b) =>
                                            Number(a.sub_category_order) -
                                            Number(b.sub_category_order)
                                    )
                                    .map((subCategory) => (
                                        <SubCategoryItem
                                            handleOpenDel={handleOpenDel}
                                            handleOpenEdit={handleOpenEdit}
                                            key={subCategory.sub_category_id}
                                            subCategory={subCategory}
                                        />
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50, 100]}
                        component="div"
                        count={subCategories.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </Box>
                {isDel && (
                    <ActionModal
                        close={handleCloseDel}
                        title="Delete sub category"
                        msg={`Are you sure you want to delete ${isDel.sub_category_name}?`}
                        handler={handleDelete}
                        loading={delLoading}
                    />
                )}
                {isEdit && (
                    <SubCategoryForm
                        subCategoryOrder={subCategories.length}
                        categoryId={categoryId}
                        close={handleCloseEdit}
                        subCategory={isEdit}
                    />
                )}
            </>
        );
    return null;
};

export default SubCategoryList;
