import { PlusOutlined } from "@ant-design/icons";
import { Link } from "@remix-run/react";
import { Button, Space, Table } from "antd";
import { useBrands } from "~/services/hooks";

const BrandsPage = () => {
  const [brands,] = useBrands();
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <h1>Brands</h1>
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
            dataIndex: "name",
          }
        ]} dataSource={brands} />
    </Space>
  );
}

export default BrandsPage;