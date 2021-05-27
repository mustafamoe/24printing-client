import { Box, Typography } from "@material-ui/core";
import ErrorIcon from "@material-ui/icons/Error";

interface IProps {
    errors: string[];
}

const Error = ({ errors }: IProps) => {
    if (errors && errors.length)
        return (
            <Box display="flex" flexDirection="column">
                {errors.map((err, i) => (
                    <Box display="flex" alignItems="center" key={i}>
                        <Box style={{ width: "20px", height: "20px" }} mr={1}>
                            <ErrorIcon
                                color="error"
                                style={{ width: "20px", height: "20px" }}
                            />
                        </Box>
                        <Typography color="error" variant="subtitle1">
                            {err}
                        </Typography>
                    </Box>
                ))}
            </Box>
        );

    return null;
};

export default Error;
