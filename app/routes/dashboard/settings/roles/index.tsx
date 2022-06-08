import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { roles } from "@prisma/client";
import { Link } from "@remix-run/react";
import { Button, Space, Table } from "antd";
import confirm from "antd/lib/modal/confirm";
import axios from "axios";
import { useState } from "react";
import { useEmployeePositions, useRoles } from "~/services/hooks";

const RolesPage = () => {
  const [roles, setRoles] = useRoles();
  const [loading, setLoading] = useState(false);

  const deleteItem = async (record: roles) => {
    confirm({
      title: "Are you sure?",
      content: "This will delete the role",
      onOk: async () => {
        setLoading(true);
        try {
          const resp = await (await axios.post("/dashboard/settings/roles/delete-post", { id: record.id })).data;
          if (resp.success && resp.data) {
            setRoles(roles.filter(c => c.id !== record.id));
          }
        } catch (error) {
          console.log(error);
        }
        setLoading(false);
      }
    });
  }

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <h1>Roles</h1>
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
          },
          {
            title: "Actions",
            dataIndex: "actions",
            width: "100px",
            render: (text, record) => (
              <Space>
                <Link to={`/dashboard/settings/roles/create?id=${record.id}`}>
                  <Button shape="circle" size="small" icon={<EditOutlined />} />
                </Link>
                <Button onClick={() => deleteItem(record)} shape="circle" size="small" icon={<DeleteOutlined />} />
              </Space>
            )
          }
        ]} dataSource={roles} />
    </Space>
  );
}

export default RolesPage;