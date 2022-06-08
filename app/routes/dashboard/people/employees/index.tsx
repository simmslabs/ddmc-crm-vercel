import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { customers, departments, employees } from "@prisma/client";
import { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { Badge, Button, Card, Space, Table } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useCustomers, useEmployees } from "~/services/hooks";
import prisma from "~/services/prisma";

const EmployeesPage = () => {

  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [_employees, setEmployees] = useEmployees();

  const deleteItem = async (record: employees) => {
    setLoading(true);
    try {
      const resp = await (await axios.post("/dashboard/people/customers/delete-post", { id: record.id })).data;
      if (resp.success && resp.data) {
        setEmployees(_employees.filter(c => c.id !== record.id));
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
            Employees
          </div>
          <Link to="create">
            <Button size="small" shape="circle" icon={<PlusOutlined />} />
          </Link>
        </Space>} loading={loading} size="small" columns={[
          {
            key: 'id',
          },
          {
            title: 'Name',
            key: 'name',
            dataIndex: 'name',
          },
          {
            key: 'email',
            title: 'Email',
            dataIndex: 'email',
          },
          {
            key: 'phone',
            title: 'Phone',
            dataIndex: 'phone',
          },
          {
            key: 'position',
            title: "Position",
            dataIndex: "position",
            render: (text, record) => {
              return record.position && record.position.title;
            }
          },
          {
            key: 'department',
            title: 'Department',
            dataIndex: 'department',
            render: (text, record) => {
              return record.department && record.department.title;
            }
          },
          {
            title: 'Salary',
            key: 'salary',
            dataIndex: 'salary',
          },
          {
            title: 'Role',
            key: 'role',
            dataIndex: 'role',
            render: (text, record) => {
              console.log(record);
              return record.role && record.role.name;
            }
          },
          {
            title: 'Status',
            key: 'employee_status',
            dataIndex: 'employee_status',
            render: (text, record) => {
              return record.employee_status == "active" ? <Badge status="success" text="Active" /> : <Badge status="error" text="Inactive" />;
            }
          },
          {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
              <Space>
                <Button onClick={() => deleteItem(record)} color="red" size="small" icon={<DeleteOutlined />} />
                <Button onClick={() => nav(`create?edit=${record.id}`)} color="green" size="small" icon={<EditOutlined />} />
              </Space>
            )
          }
        ]} dataSource={_employees} />
      </Space>
    </div>
  );
};

export default EmployeesPage;