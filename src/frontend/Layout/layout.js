import React, { useState } from 'react'
import { Link } from "react-router-dom"
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
        <Link to="/NTSCalulator" >
          <Box className='header-links'>
              {!isMobile && <Typography variant="h6">NTS Calculator</Typography>}
              {/* <Typography variant="h4">SIT Calculator</Typography> */}
          </Box>
        </Link>
        <Link to="/PPMCalulator" >
          <Box className='header-links'>
              {!isMobile && <Typography variant="h6">PPM Calculator</Typography>}
          </Box>
        </Link>
    </Box>
    {children}

    </Stack>
  )
}

export default Layout