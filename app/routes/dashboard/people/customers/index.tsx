import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { customers } from "@prisma/client";
import { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { Button, Card, Space, Table } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useCustomers } from "~/services/hooks";
import prisma from "~/services/prisma";

const CustomersPage = () => {

  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useCustomers();

  const deleteItem = async (record: customers) => {
    setLoading(true);
    try {
      const resp = await (await axios.post("/dashboard/people/customers/delete-post", { id: record.id })).data;
      if (resp.success && resp.data) {
        setCustomers(customers.filter(c => c.id !== record.id));
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <div>
      <Space style={{ width: '100%' }} direction="vertical">
        <Table title={() => <Space>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
            Customers
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
        ]} dataSource={customers} />
      </Space>
    </div>
  );
};

export default CustomersPage;