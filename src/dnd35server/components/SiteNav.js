import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, PageHeader, Layout, Breadcrumb } from 'antd';
import {
  HomeOutlined,
  AliwangwangOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;

export default function SiteNav(props) {
  const siteDrawerItems = [
    { text: 'D&D 3.5 Open API', icon: <HomeOutlined />, route: '/' },
    { text: 'About', icon: <InfoCircleOutlined />, route: '/about' },
  ];
  const dndDrawerItems = [
    { text: 'Monsters', icon: <AliwangwangOutlined />, route: '/monsters' },
  ];

  // check screen size for mobile menu
  const [menuCollasped, setMenuCollasped] = useState(false);

  useEffect(() => {
    window.screen.width <= 993
      ? setMenuCollasped(true)
      : setMenuCollasped(false);
  });

  const router = useRouter();

  // Routes for breadcrumb, include home bread crumb
  const homeBreadcrumb = {
    path: '/',
    breadcrumbName: 'D&D 3.5 Open API',
  };
  // Check url path and add sub paths to breadcrumb
  const subPaths = router.pathname.slice(1).split('/');
  // Add sub routes to routes array
  const subBreadCrumbs = subPaths.map((subRoute, index) => {
    // name for route
    let breadcrumbName = capitalizeFirstLetter(subRoute);
    // full path array
    let pathArray = subPaths.slice(0, index + 1);
    // full path string
    pathArray[0] = `/${pathArray[0]}`;
    let path = pathArray.join('/');
    return { breadcrumbName, path };
  });
  const routes = [homeBreadcrumb, ...subBreadCrumbs];
  const breadcrumbsComponent = (
    <Breadcrumb>
      {routes.map((route) => (
        <Breadcrumb.Item key={route.path}>
          <Link href={route.path}>{route.breadcrumbName}</Link>
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );

  return (
    <Layout id='site-layout'>
      <Sider
        id={menuCollasped ? 'mobile-menu' : null}
        breakpoint='lg'
        collapsedWidth='0'
        onBreakpoint={(broken) => {
          menuCollasped ? setMenuCollasped(false) : setMenuCollasped(true);
        }}
      >
        <Menu>
          {siteDrawerItems.map((item, index) => (
            <Menu.Item
              button
              key={item.text}
              icon={item.icon}
              disabled={router.pathname === item.route}
            >
              <Link href={item.route}>{item.text}</Link>
            </Menu.Item>
          ))}
          <Menu.Divider />
          {dndDrawerItems.map((item, index) => (
            <Menu.Item
              button
              key={item.text}
              icon={item.icon}
              disabled={router.pathname === item.route}
            >
              <Link href={item.route}>{item.text}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout style={{ paddingTop: menuCollasped ? 42 : 0 }}>
        <PageHeader
          className='site-page-header'
          title={props.title}
          subTitle={props.subTitle}
          breadcrumb={breadcrumbsComponent}
        ></PageHeader>
        <Content style={{ margin: '24px 16px 0' }}>{props.children}</Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
}

// Helper functions
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
