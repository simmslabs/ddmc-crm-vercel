import { PlusOutlined } from "@ant-design/icons";
import { Link } from "@remix-run/react";
import { Button, Space, Table } from "antd";
import { useDepartments } from "~/services/hooks";

const DepartmentsPage = () => {
  const [departments,] = useDepartments();
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <h1>Departments</h1>
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
        ]} dataSource={departments} />
    </Space>
  );
}

export default DepartmentsPage;