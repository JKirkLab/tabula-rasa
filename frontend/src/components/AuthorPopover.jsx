import React, { useState } from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

function AuthorPopover() {
    const [anchorEl, setAnchorEl] = useState(null);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <>
            <span
                style={{ textDecoration: 'underline', cursor: 'pointer' }}
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
            >
                Jonathan A. Kirk<sup>1†</sup>
            </span>
            <Popover
                id="mouse-over-popover"
                sx={{ pointerEvents: 'none' }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <Typography sx={{ p: 1 }}>
                    Corresponding Author <br />
                    
                    Jonathan A. Kirk, Ph.D.<br />

                    Department of Cell and Molecular Physiology<br />

                    Loyola University Chicago Stritch School of Medicine<br />

                    Center for Translational Research, Room 522<br />

                    2160 S. First Ave. Maywood, IL 60153<br />

                    Ph: 708-216-6348</Typography>
            </Popover>
        </>
    );

}

export default AuthorPopover