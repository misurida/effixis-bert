import { CSSProperties, useEffect, useState } from 'react';
import { IconMoonStars, IconSun } from '@tabler/icons';
import { ActionIcon, AppShell, Group, Header, Title, Text, useMantineTheme, useMantineColorScheme, Stack, Aside, MediaQuery, Navbar, Burger, NavLink, Box } from '@mantine/core';
import Head from 'next/head';
import DataLoadForm from '../DataLoadForm';
import EntitiesList from '../EntitiesList';
import { useRouter } from 'next/router';
import Link from 'next/link';


export interface PageLayoutProps {
  children?: React.ReactNode
  auth?: boolean
  footer?: React.ReactElement<any, string | React.JSXElementConstructor<any>>
  noBoxWidth?: boolean
}


export default function PageLayout(props: PageLayoutProps) {

  const router = useRouter()
  const theme = useMantineTheme();
  const { toggleColorScheme } = useMantineColorScheme();
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    setOpened(false)
  }, [router.pathname])

  const buildLinks = (style?: CSSProperties) => {
    const s = { textDecoration: "none", ...style }
    return (
      <>
        <Link href="/events" passHref>
          <NavLink component="a" style={s} label="Events" active={router.pathname === '/events'} />
        </Link>
        <Link href="/topics" passHref>
          <NavLink component="a" style={s} label="Topics" active={router.pathname === '/topics'} />
        </Link>
        <Link href="/articles" passHref>
          <NavLink component="a" style={s} label="Articles" active={router.pathname === '/articles'} />
        </Link>
      </>
    )
  }

  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      navbar={
        <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
          <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
            <Box mb="md" sx={{ width: "100%", display: "flex", marginRight: "auto" }}>
              {buildLinks({ textAlign: "center" })}
            </Box>
          </MediaQuery>
          <DataLoadForm />
          <EntitiesList />
        </Navbar>
      }
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      header={
        <Header height={70} p="md" >
          <Group style={{ alignItems: 'center' }}>
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
              />
            </MediaQuery>
            <Stack mr="lg" spacing={0} onClick={() => router.push('/')} sx={{ cursor: "pointer", transition: "opacity .2s", userSelect: "none", "&:hover": { opacity: 0.5 } }}>
              <Title size="md" order={1}>Effixis</Title>
              <Text size="xs">BTT Standalone</Text>
            </Stack>
            <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
              <Box sx={{ width: "auto", display: "flex", marginRight: "auto" }}>
                {buildLinks()}
              </Box>
            </MediaQuery>
            <ActionIcon ml="auto" variant="subtle" onClick={() => toggleColorScheme()} size={30}>
              {theme.colorScheme === 'dark' ? <IconSun size={16} /> : <IconMoonStars size={16} />}
            </ActionIcon>
          </Group>
        </Header>
      }
    >
      <Head>
        <title>BTT Standalone</title>
        <meta name="description" content="Effixis - BTT Standalone" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {props.children}
    </AppShell>
  )
}
