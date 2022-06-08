import { BankOutlined, BarsOutlined, BoxPlotOutlined, CaretRightFilled, PaperClipOutlined, SecurityScanOutlined, SisternodeOutlined, UserSwitchOutlined } from "@ant-design/icons";
import { Link } from "@remix-run/react";
import { Col, Row, Space } from "antd";

const SettingsPage = () => {
  return (
    <div>
      <Space style={{ width: '100%' }} direction="vertical">
        <h1>Settings</h1>
        <Row gutter={[10, 10]}>
          <Col md={6}>
            <Link to="departments" className="settings-card">
              <Space>
                <div className="icon">
                  <SisternodeOutlined style={{ fontSize: '40px' }} />
                </div>
                <span className="title">Departments</span>
              </Space>
            </Link>
          </Col>
          <Col md={6}>
            <Link to="positions" className="settings-card">
              <Space>
                <div className="icon">
                  <UserSwitchOutlined style={{ fontSize: '40px' }} />
                </div>
                <span className="title">Employee Positions</span>
              </Space>
            </Link>
          </Col>
          <Col md={6}>
            <Link to="media-types" className="settings-card">
              <Space>
                <div className="icon">
                  <PaperClipOutlined style={{ fontSize: '40px' }} />
                </div>
                <span className="title">Media Types</span>
              </Space>
            </Link>
          </Col>
          <Col md={6}>
            <Link to="media-sizes" className="settings-card">
              <Space>
                <div className="icon">
                  <BoxPlotOutlined style={{ fontSize: '40px' }} />
                </div>
                <span className="title">Media Sizes</span>
              </Space>
            </Link>
          </Col>
          <Col md={6}>
            <Link to="brands" className="settings-card">
              <Space>
                <div className="icon">
                  <BarsOutlined style={{ fontSize: '40px' }} />
                </div>
                <span className="title">Brands</span>
              </Space>
            </Link>
          </Col>
          <Col md={6}>
            <Link to="roles" className="settings-card">
              <Space>
                <div className="icon">
                  <SecurityScanOutlined style={{ fontSize: '40px' }} />
                </div>
                <span className="title">Roles</span>
              </Space>
            </Link>
          </Col>
          <Col md={6}>
            <Link to="accounts" className="settings-card">
              <Space>
                <div className="icon">
                  <BankOutlined style={{ fontSize: '40px' }} />
                </div>
                <span className="title">Accounts</span>
              </Space>
            </Link>
          </Col>
          <Col md={6}>
            <Link to="categories" className="settings-card">
              <Space>
                <div className="icon">
                  <CaretRightFilled style={{ fontSize: '40px' }} />
                </div>
                <span className="title">Categories</span>
              </Space>
            </Link>
          </Col>
          <Col md={6}>
            <Link to="project-categories" className="settings-card">
              <Space>
                <div className="icon">
                  <CaretRightFilled style={{ fontSize: '40px' }} />
                </div>
                <span className="title">Project Categories</span>
              </Space>
            </Link>
          </Col>
        </Row>
      </Space>
    </div >
  );
}

export default SettingsPage;