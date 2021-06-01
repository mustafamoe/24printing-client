import useSwr from "swr";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
    AccordionSummary,
    Accordion,
    AccordionDetails,
    Button,
    Typography,
    Box,
} from "@material-ui/core";
import { useState } from "react";
import { ISubCategory } from "../../../types/subCategory";
import { mutate } from "swr";
import { apiCall } from "../../../utils/apiCall";
import { useSelector } from "react-redux";
import { RootReducer } from "../../../store/reducers";

// components
import SubCategoryList from "./subCategoryItem";
import SubCategoryForm from "./subCategoryForm";
import ActionModal from "../actionModal";

// icons
import Add from "@material-ui/icons/Add";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { ICategory } from "../../../types/category";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        table: {
            minWidth: 650,
        },
        heading: {
            fontSize: theme.typography.pxToRem(20),
            width: "100%",
        },
        accHeader: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
        },
    })
);

const CategoryList = () => {
    const user = useSelector((state: RootReducer) => state.auth.user);
    const classes = useStyles();
    const { data: categories } = useSwr<ICategory[]>("/categories");
    const [isAdd, setAdd] = useState<string | false>(false);
    const [expanded, setExpanded] = useState<string | false>(false);

    const closeAdd = (e) => {
        setAdd(false);
    };

    const openAdd: any = (e, categoryId: string) => {
        if (!isAdd && expanded === categoryId) {
            e.stopPropagation();
        }
        setAdd(categoryId);
    };

    const handleExpand =
        (panel: string) =>
        (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

    if (categories)
        return (
            <>
                <Box
                    style={{
                        backgroundColor: "rgb(243, 243, 243)",
                        padding: "10px",
                    }}
                >
                    {categories
                        .sort(
                            (a, b) =>
                                Number(a.category_order) -
                                Number(b.category_order)
                        )
                        .map((c) => (
                            <Accordion
                                TransitionProps={{ unmountOnExit: true }}
                                key={c.category_id}
                                expanded={expanded === c.category_id}
                                onChange={handleExpand(c.category_id)}
                            >
                                <AccordionSummary
                                    classes={{ root: classes.accHeader }}
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel2a-content"
                                    id="panel2a-header"
                                >
                                    <Typography className={classes.heading}>
                                        {c.category_name}
                                    </Typography>
                                    <Box>
                                        <Button
                                            style={{ whiteSpace: "nowrap" }}
                                            startIcon={<Add />}
                                            variant="contained"
                                            type="button"
                                            onClick={
                                                !isAdd
                                                    ? (e) =>
                                                          openAdd(
                                                              e,
                                                              c.category_id
                                                          )
                                                    : (e) => e.stopPropagation()
                                            }
                                            color="primary"
                                        >
                                            add sub category
                                        </Button>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <SubCategoryList
                                        categoryId={c.category_id}
                                    />
                                </AccordionDetails>
                            </Accordion>
                        ))}
                </Box>
                {isAdd && (
                    <SubCategoryForm categoryId={isAdd} close={closeAdd} />
                )}
            </>
        );
    return null;
};

export default CategoryList;
