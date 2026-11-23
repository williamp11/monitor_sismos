import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import PublicIcon from '@mui/icons-material/Public';

interface HeaderProps {
    title: string;
    source: string;
    updatedAt: string;
    alertCount: number;
}

export default function Header({ title, source, updatedAt, alertCount }: HeaderProps) {
    return (
        <AppBar position="sticky" elevation={0}>
            <Toolbar sx={{ gap: 1.5 }}>

                {/* Menú hamburguesa: solo en móvil */}
                <IconButton color="inherit" edge="start" sx={{ display: { xs: 'inline-flex', md: 'none' } }}>
                    <MenuIcon />
                </IconButton>

                <PublicIcon color="secondary" />

                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography variant="h6" component="h1" noWrap sx={{ fontSize: { xs: 17, md: 20 } }}>
                        {title}
                    </Typography>
                    {/* Fuente y fecha: solo en escritorio */}
                    <Typography variant="caption" sx={{ display: { xs: 'none', md: 'block' }, opacity: 0.8 }}>
                        Fuente: {source} · Actualizado: {updatedAt}
                    </Typography>
                </Box>

                <IconButton color="inherit">
                    <Badge badgeContent={alertCount} color="secondary">
                        <NotificationsNoneIcon />
                    </Badge>
                </IconButton>

            </Toolbar>
        </AppBar>
    );
}