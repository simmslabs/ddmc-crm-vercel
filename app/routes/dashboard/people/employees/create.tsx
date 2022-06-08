import { customers, employees } from "@prisma/client";
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { Button, Card, Col, Grid, Input, Row, Select, Space } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useCustomers, useDepartments, useEmployeePositions, useEmployees, useRoles } from "~/services/hooks";
import prisma from "~/services/prisma";
import { employees_type } from "~/services/types";

export const loader: LoaderFunction = ({ request }) => {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);
  const edit = params.get("edit");
  if (edit) {
    const employee = prisma.employees.findFirst({ where: { id: parseInt(edit) }, include: { department: true, position: true } });
    return employee;
  }
  return null;
}

const CustomerCreatePage = () => {

  const employee = useLoaderData<employees_type | null>();

  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState<number>();
  const [position, setPosition] = useState<number>();
  const [salary, setSalary] = useState('');
  const [status, setStatus] = useState('active');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<number>();

  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState<number | null>();

  const [departments, setDepartments] = useDepartments();
  const [_employees, setEmployees] = useEmployees()
  const [positions, setPositions] = useEmployeePositions();
  const [roles, setRoles] = useRoles();
  const nav = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { success, data, message }: { success: boolean, data: employees_type, message: string } = await (await axios.post("create-post", {
        fullname,
        email,
        phone,
        update,
        department,
        position,
        salary,
        status,
        password,
        role
      })).data;
      if (success && data) {
        setFullname('');
        setEmail('');
        setPhone('');
        if (!update) {
          setEmployees([data, ..._employees]);
        } else {
          setEmployees(_employees.map(e => e.id === data.id ? data : e));
        }
        nav("/dashboard/people/employees");
      }
    } catch (error) {
      console.log(error);

    }
    setLoading(false);
  }

  useEffect(() => {
    if (employee) {
      setFullname(employee.name);
      setEmail(employee.email);
      setPhone(employee.phone);
      setDepartment(employee.department.id);
      setPosition(employee.position.id);
      setSalary(employee.salary);
      setUpdate(employee.id);
      setPassword('');
      if (employee.role_id) {
        setRole(employee.role_id);
      }
    }
  }, [])

  return (
    <Row>
      <Col md={6}>
        <Card title="Create Employee">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Input disabled={loading} value={fullname} onChange={(e) => setFullname(e.target.value)} placeholder="Name" />
            <Input disabled={loading} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" />
            <Input disabled={loading} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" />
            <Input disabled={loading} value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="Salary" />
            <Select placeholder="Select Department" style={{ width: '100%' }} value={department} onChange={(e) => setDepartment(e)}>
              {departments.map(d => <Select.Option key={d.id} value={d.id}>{d.title}</Select.Option>)}
            </Select>
            <Select placeholder="Select Position" style={{ width: '100%' }} value={position} onChange={(e) => setPosition(e)}>
              {positions.map(d => <Select.Option key={d.id} value={d.id}>{d.title}</Select.Option>)}
            </Select>
            <Select placeholder="Role" style={{ width: '100%' }} value={role} onChange={(e) => setRole(e)}>
              {roles.map(d => <Select.Option key={d.id} value={d.id}>{d.name}</Select.Option>)}
            </Select>
            <Select placeholder="Status" style={{ width: '100%' }} value={status} onChange={(e) => setStatus(e)}>
              <Select.Option value='active'>Active</Select.Option>
              <Select.Option value='inactive'>Inactive</Select.Option>
            </Select>
            <Input type="password" disabled={loading} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <Button onClick={() => handleSubmit()} disabled={loading} loading={loading} type="primary">
              {update ? "Update" : "Create"}
            </Button>
          </Space>
        </Card>
      </Col>
    </Row>
  );
};

export default CustomerCreatePage;