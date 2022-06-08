import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { suppliers } from "@prisma/client";
import { Link, useNavigate } from "@remix-run/react";
import { Button, Card, Space, Table } from "antd";
import axios from "axios";
import { useState } from "react";
import { useSuppliers } from "~/services/hooks";

const SuppliersPage = () => {

  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useSuppliers();

  const deleteItem = async (record: suppliers) => {
    setLoading(true);
    try {
      const resp = await (await axios.post("/dashboard/people/suppliers/delete-post", { id: record.id })).data;
      if (resp.success && resp.data) {
        setSuppliers(suppliers.filter(c => c.id !== record.id));
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <Space style={{ width: '100%' }} direction="vertical">
      <Table title={() => <Space>
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
          Suppliers
        </div>
        <Link to="create">
          <Button size="small" shape="circle" icon={<PlusOutlined />} />
        </Link>
      </Space>} loading={loading} size="small" columns={[
        {
          title: 'Name',
          dataIndex: 'name',
        },
        {
          title: 'Email',
          dataIndex: 'email',
        },
        {
          title: 'Phone',
          dataIndex: 'phone',
        },
        {
          title: 'Actions',
          render: (text, record) => (
            <Space>
              <Button onClick={() => deleteItem(record)} color="red" size="small" icon={<DeleteOutlined />} />
              <Button onClick={() => nav(`create?edit=${record.id}`)} color="green" size="small" icon={<EditOutlined />} />
            </Space>
          )

        }
      ]} dataSource={suppliers} />
    </Space>
  );
}

export default SuppliersPage;