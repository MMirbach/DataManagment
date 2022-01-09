import { AccountCircle, VisibilityOff, Visibility } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import {
    Box,
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    IconButton,
    Typography,
    Collapse,
    Alert,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";

interface CredFormState {
    username: string;
    password: string;
    msg: string;
    showPassword: boolean;
    loading: boolean;
}

interface CredFormProps {
    onSubmit: (username: string, password: string) => Promise<string>;
}

const CredForm: React.FC<CredFormProps> = ({ onSubmit }) => {
    const [creds, setCreds] = useState<CredFormState>({
        username: "",
        password: "",
        msg: "",
        showPassword: false,
        loading: false,
    });

    const handleChange =
        (prop: keyof CredFormState) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setCreds({ ...creds, [prop]: event.target.value });
        };

    const handleClickShowPassword = () => {
        setCreds({
            ...creds,
            showPassword: !creds.showPassword,
        });
    };

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
    };

    const handleSubmit = async (): Promise<void> => {
        setCreds({
            ...creds,
            loading: true,
        });
        const res: string = await onSubmit(creds.username, creds.password);
        setCreds({
            ...creds,
            username: "",
            password: "",
            msg: res,
            loading: false,
        });
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
            }}
        >
            <Collapse in={creds.msg !== ""}>
                <Alert
                    severity={creds.msg === "Success" ? "success" : "error"}
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setCreds({
                                    ...creds,
                                    msg: "",
                                });
                            }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{ mb: 2 }}
                >
                    {creds.msg}
                </Alert>
            </Collapse>
            <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-username">
                    Username
                </InputLabel>
                <OutlinedInput
                    id="outlined-adornment-username"
                    type={"text"}
                    value={creds.username}
                    onChange={handleChange("username")}
                    label="Username"
                    endAdornment={
                        <InputAdornment position="end">
                            <AccountCircle />
                        </InputAdornment>
                    }
                />
            </FormControl>
            <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                    Password
                </InputLabel>
                <OutlinedInput
                    id="outlined-adornment-password"
                    type={creds.showPassword ? "text" : "password"}
                    value={creds.password}
                    onChange={handleChange("password")}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {creds.showPassword ? (
                                    <VisibilityOff />
                                ) : (
                                    <Visibility />
                                )}
                            </IconButton>
                        </InputAdornment>
                    }
                    label="Password"
                />
            </FormControl>
            <LoadingButton
                onClick={handleSubmit}
                endIcon={<SendIcon />}
                loading={creds.loading}
                loadingPosition="end"
                variant="contained"
                sx={{ width: "15ch", m: 1 }}
            >
                Submit
            </LoadingButton>
        </Box>
    );
};

export default CredForm;
