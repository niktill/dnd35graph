import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, Layout } from 'antd';
import {
  HomeOutlined,
  AliwangwangOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;

export default function SiteNav(props) {
  const siteDrawerItems = [
    { text: 'Home', icon: <HomeOutlined />, route: '/' },
    { text: 'About', icon: <InfoCircleOutlined />, route: '/about' },
  ];
  const dndDrawerItems = [
    { text: 'Monsters', icon: <AliwangwangOutlined />, route: '/monsters' },
  ];

  const router = useRouter();

  return (
    <Layout id='site-layout'>
      <Sider
        breakpoint='lg'
        collapsedWidth='0'
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <Menu mode='inline'>
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
      <Layout>
        <Content style={{ margin: '24px 16px 0' }}>{props.children}</Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
}
