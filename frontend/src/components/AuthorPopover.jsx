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

                    Department of Medicine, Section of Cardiology<br />

                    University of Chicago<br />

                    Goldblatt Building, Room G611B, MC 6080 <br />

                    5841 S. Maryland Ave., Chicago, IL 60637<br />

                    Ph: 773.795.9308</Typography>
            </Popover>
        </>
    );

}

export default AuthorPopover