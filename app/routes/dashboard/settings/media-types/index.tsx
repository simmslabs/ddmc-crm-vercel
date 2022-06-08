import { PlusOutlined } from "@ant-design/icons";
import { Link } from "@remix-run/react";
import { Button, Space, Table } from "antd";
import { useMediaTypes } from "~/services/hooks";

const SettingsMediaTypePage = () => {
  const [mediaTypes,] = useMediaTypes();
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <h1>Media Types</h1>
      <Table title={() => (
        <Space>
          <Link to="create">
            <Button shape="circle" size="small" icon={<PlusOutlined />} ></Button>
          </Link>
        </Space>
      )}
        columns={[
          {
            title: "Title",
            dataIndex: "title",
          }
        ]} dataSource={mediaTypes} />
    </Space>
  );
}

export default SettingsMediaTypePage;