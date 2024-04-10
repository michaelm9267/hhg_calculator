import React, { useState } from 'react'
import { Box, Stack, Typography, useTheme, useMediaQuery } from '@mui/material'
import Hamburger from 'hamburger-react'

const Layout = ({children}) => {
    const [isOpen, setOpen] = useState(false)
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <Stack >
    <Box className='layout-header'>
        {isMobile ? <Hamburger className={'menu'} toggled={isOpen} toggle={setOpen} onToggle={() => setOpen(!isOpen)} /> : null}
        <Typography variant={isMobile ? "h5" : "h2"}>HHG Tools</Typography>
        <Box className='header-links'>
            {!isMobile && <Typography variant="h4">NTS Calculator</Typography>}
            {/* <Typography variant="h4">SIT Calculator</Typography> */}
        </Box>
    </Box>
    {children}

    </Stack>
  )
}

export default Layout