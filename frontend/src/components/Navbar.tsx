import {
    AppBar,
    Box,
    Button,
    ButtonGroup,
    Container,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React from "react";
import { useState } from "react";

interface NavBarProps {
    onShowAdmins: () => void;
    onAddAdmin: () => void;
    onCreatePoll: () => void;
    onLogOut: () => void;
}

const Navbar: React.FC<NavBarProps> = ({
    onShowAdmins,
    onAddAdmin,
    onCreatePoll,
    onLogOut,
}) => {
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
        <AppBar position="sticky">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
                    >
                        Polls
                    </Typography>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "flex", md: "none" },
                        }}
                    >
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: "block", md: "none" },
                            }}
                        >
                            <MenuItem key={0} onClick={onShowAdmins}>
                                <Typography textAlign="center">
                                    Show Admins
                                </Typography>
                            </MenuItem>
                            <MenuItem key={1} onClick={onAddAdmin}>
                                <Typography textAlign="center">
                                    Add Admin
                                </Typography>
                            </MenuItem>
                            <MenuItem key={2} onClick={onCreatePoll}>
                                <Typography textAlign="center">
                                    Create Poll
                                </Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{
                            flexGrow: 1,
                            display: { xs: "flex", md: "none" },
                        }}
                    >
                        Polls
                    </Typography>
                    <ButtonGroup
                        variant="text"
                        color="inherit"
                        sx={{
                            ml: 2,
                            flexGrow: 1,
                            display: { xs: "none", md: "flex" },
                        }}
                    >
                        <Button
                            key={0}
                            onClick={onShowAdmins}
                            sx={{ my: 2, color: "white", display: "block" }}
                        >
                            Show Admins
                        </Button>
                        <Button
                            key={1}
                            onClick={onAddAdmin}
                            sx={{ my: 2, color: "white", display: "block" }}
                        >
                            Add Admin
                        </Button>
                        <Button
                            key={2}
                            onClick={onCreatePoll}
                            sx={{ my: 2, color: "white", display: "block" }}
                        >
                            Create Poll
                        </Button>
                    </ButtonGroup>
                    <Button
                        key={3}
                        onClick={onLogOut}
                        sx={{ my: 2, color: "white", display: "block" }}
                    >
                        Log Out
                    </Button>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
