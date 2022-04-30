import * as React from 'react'
import { ChakraProvider, Box, Grid, VStack, extendTheme, ThemeConfig } from '@chakra-ui/react'
import { ColorModeSwitcher } from './ColorModeSwitcher'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import './i18n'
import 'react-datepicker/dist/react-datepicker.css'
const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const theme = extendTheme({ config })

export const App = () => {
  const [logged, setLogged] = React.useState(false)

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <VStack padding={8}>{logged ? <Dashboard /> : <Login login={() => setLogged(true)} />}</VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  )
}
