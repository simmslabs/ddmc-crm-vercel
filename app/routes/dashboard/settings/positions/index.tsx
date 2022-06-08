import { PlusOutlined } from "@ant-design/icons";
import { Link } from "@remix-run/react";
import { Button, Space, Table } from "antd";
import { useEmployeePositions } from "~/services/hooks";

const DepartmentsPage = () => {
  const [positions,] = useEmployeePositions();
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <h1>Employee Positions</h1>
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
        ]} dataSource={positions} />
    </Space>
  );
}

export default DepartmentsPage;