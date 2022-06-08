import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { accounts } from "@prisma/client";
import { Link } from "@remix-run/react";
import { Button, message, Space, Table } from "antd";
import confirm from "antd/lib/modal/confirm";
import axios from "axios";
import { useState } from "react";
import { useAccounts } from "~/services/hooks";

const BrandsPage = () => {

  const [accounts, setAccounts] = useAccounts();
  const [del_loading, setDel_loading] = useState(false);

  const deleteItem = async (_data: accounts) => {
    confirm({
      title: `Are you sure delete ${_data.name} ?`, onOk: async () => {
        setDel_loading(true);
        try {
          const resp: accounts = await (await axios.post("/dashboard/settings/accounts/delete-post", { id: _data.id })).data;
          if (resp.id) {
            {
              setAccounts(accounts.filter(p => p.id !== resp.id));
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
      <h1>Accounts</h1>
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
            title: "Description",
            dataIndex: "description",
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
        ]} dataSource={accounts} />
    </Space>
  );
}

export default BrandsPage;