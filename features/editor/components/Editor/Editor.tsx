import { Provider } from 'react-redux'
import { AppShell } from '@mantine/core'

import store from '../../stores/store'
import { AppHeader } from '../Layout/AppHeader'
import { AppNavbar } from '../Layout/AppNavbar'
import { Page } from '../Page'

export function Editor() {
  return (
    <Provider store={store}>
      <AppShell
        fixed
        padding={'md'}
        header={<AppHeader />}
        navbar={<AppNavbar />}
        styles={(theme) => ({
          main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
        })}
      >
        <Page />
      </AppShell>
    </Provider>
  )
}
