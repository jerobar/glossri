import { Navbar, Tabs } from '@mantine/core'

import { PagesMenu } from '../../PagesMenu'
import { BlocksMenu } from '../../BlocksMenu'

export function AppNavbar() {
  return (
    <Navbar width={{ base: 300 }}>
      <Tabs variant={'outline'}>
        <Tabs.Tab label={'Pages'}>
          <PagesMenu />
        </Tabs.Tab>
        <Tabs.Tab label={'Blocks'}>
          <BlocksMenu />
        </Tabs.Tab>
      </Tabs>
    </Navbar>
  )
}
