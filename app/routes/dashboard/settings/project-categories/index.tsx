import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { accounts, project_categories } from "@prisma/client";
import { Link } from "@remix-run/react";
import { Button, message, Space, Table } from "antd";
import confirm from "antd/lib/modal/confirm";
import axios from "axios";
import { useState } from "react";
import { useAccounts, useProjectCategories } from "~/services/hooks";

const BrandsPage = () => {

  const [projectCategories, setProjectCategories] = useProjectCategories();
  const [del_loading, setDel_loading] = useState(false);

  const deleteItem = async (_data: project_categories) => {
    confirm({
      title: `Are you sure delete ${_data.title} ?`, onOk: async () => {
        setDel_loading(true);
        try {
          const resp: accounts = await (await axios.post("/dashboard/settings/project-categories/delete-post", { id: _data.id })).data;
          if (resp.id) {
            {
              setProjectCategories(projectCategories.filter(p => p.id !== resp.id));
            }
          }
        } catch (error: any) {
          message.error(error.message);
        }
        setDel_loading(false);
      }
    });
  }

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <h1>Project Categories</h1>
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
          },
          {
            title: "Actions",
            dataIndex: "actions",
            render: (t, data) => (<Space>
              <Link to={`create?id=${data.id}`}>
                <Button shape="circle" size="small" icon={<EditOutlined />} />
              </Link>
              <Button onClick={() => deleteItem(data)} size="small" icon={<DeleteOutlined />} shape="circle" />
            </Space>)
          }
        ]} dataSource={projectCategories} />
    </Space>
  );
}

export default BrandsPage;