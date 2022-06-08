import { BarChartOutlined, CloudServerOutlined, CreditCardOutlined, DatabaseOutlined, HomeOutlined, PaperClipOutlined, PieChartFilled, ProjectOutlined, SettingOutlined, UserOutlined, UserSwitchOutlined } from "@ant-design/icons";
import { Link, useNavigate, useTransition } from "@remix-run/react";
import { Button, Col, Dropdown, Image, Layout, Menu, MenuProps, Row, Space } from "antd";
import Avatar from "antd/lib/avatar/avatar";
const { Header, Footer, Sider, Content } = Layout;
import { ReactChild, ReactFragment, ReactNode, ReactPortal, useEffect, useState } from "react";
import logo from "~/imgs/logo.webp";
import { useMenyKeyState, usePerms, useSession } from "~/services/hooks";

const DashboardLayout = (props: any) => {

  const nav = useNavigate();
  const [width, setWidth] = useState(250);

  const [session, setSession] = useSession();
  const perms = usePerms();

  const trans = useTransition();

  const logout = () => {
    setSession(null);
  }

  const menuClick: MenuProps['onClick'] = (e) => {
    nav(e.key);
  }

  useEffect(() => {
    if (!session) {
      window.location.href = "/";
    }
  }, [session]);

  useEffect(() => {
    if (perms) {
      console.log(perms.can("view people"));
    }
  }, [perms]);

  return (
    <Layout hasSider>
      {perms && (
        <Sider width={width} style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }} theme="light">
          <div style={{ height: '100px', backgroundImage: `url(${logo})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: 'contain' }} className="logo">
          </div>
          <Menu mode="inline" onClick={menuClick}>
            {/* <Menu.Item key="/dashboard/" icon={<HomeOutlined />}>Dashboard</Menu.Item> */}
            {perms.can("view people") && (
              <Menu.ItemGroup title={<Space><UserSwitchOutlined /> People</Space>}>
                <Menu.Item key="/dashboard/people/customers">Customers</Menu.Item>
                <Menu.Item key="/dashboard/people/suppliers">Suppliers</Menu.Item>
                <Menu.Item key="/dashboard/people/employees">Employees</Menu.Item>
              </Menu.ItemGroup>
            )}
            {perms.can("view sales") && (
              <Menu.ItemGroup title={<Space><PaperClipOutlined /> Sales</Space>}>
                <Menu.Item key="/dashboard/sales/invoice">Invoice</Menu.Item>
                <Menu.Item key="/dashboard/sales/quotes">Quotes</Menu.Item>
              </Menu.ItemGroup>
            )}
            {perms.can("view purchases") && (
              <Menu.ItemGroup title={<Space><PieChartFilled /> Purchase</Space>}>
                <Menu.Item key="/dashboard/purchase/invoice">Invoice</Menu.Item>
                {/* <Menu.Item key="/dashboard/purchase/orders">Orders</Menu.Item> */}
              </Menu.ItemGroup>
            )}
            {perms.can("view project") && (
              <Menu.ItemGroup key="projects" title={<Space><DatabaseOutlined /> Projects</Space>}>
                <Menu.Item key="/dashboard/projects">Project</Menu.Item>
                {/* <Menu.Item key="/dashboard/projects/task">Task</Menu.Item> */}
                {/* <Menu.Item key="/dashboard/projects/timesheet">Timesheet</Menu.Item> */}
                {/* <Menu.Item key="/dashboard/projects/jobs/order">Job Order</Menu.Item> */}
              </Menu.ItemGroup>
            )}
            {perms.can("view price lists") && (
              <Menu.ItemGroup title="Products & Services">
                <Menu.Item key="pands/products">
                  Product Price List
                </Menu.Item>
                <Menu.Item key="pands/services">Service Price List</Menu.Item>
              </Menu.ItemGroup>
            )}
            {perms.can("view products services") && (
              <Menu.ItemGroup title="Others">
                <Menu.Item key="/dashboard/pandr" icon={<CloudServerOutlined />}>
                  Payments And Receipts
                </Menu.Item>
              </Menu.ItemGroup>
            )}
          </Menu>
        </Sider>
      )}
      <Layout>
        <Header>
          <Row justify="end">
            <Col>
              <Space>
                <Dropdown overlay={<Menu>
                  <Menu.Item onClick={() => logout()} key="1">Logout</Menu.Item>
                </Menu>}>
                  <Space>
                    <Avatar style={{ backgroundColor: '#87d068' }}>{session?.name.split(" ")[0][0].toUpperCase()}</Avatar>
                  </Space>
                </Dropdown>
                {perms && perms.can("view settings") && (
                  <Link to="/dashboard/settings">
                    <Button shape="circle" icon={<SettingOutlined />} />
                  </Link>
                )}
              </Space>
            </Col>
          </Row>
        </Header>
        <Content style={{ margin: `2px ${width}px 0`, overflow: 'initial' }}>
          {trans.state == "loading" && (
            <div className="loader">
              <span>Loading ....</span>
            </div>
          )}
          {props.children}
        </Content>
        <Footer></Footer>
      </Layout>
    </Layout >
  );
}

export default DashboardLayout;