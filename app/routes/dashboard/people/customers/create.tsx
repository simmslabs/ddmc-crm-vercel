import { customers } from "@prisma/client";
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { Button, Card, Col, Grid, Input, Row, Space } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useCustomers } from "~/services/hooks";
import prisma from "~/services/prisma";

export const loader: LoaderFunction = ({ request }) => {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);
  const edit = params.get("edit");
  if (edit) {
    const customer = prisma.customers.findFirst({ where: { id: parseInt(edit) } });
    return customer;
  }
  return null;
}

const CustomerCreatePage = () => {

  const customer = useLoaderData<customers | null>();

  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState<number | null>();
  const [_customers, setCustomers] = useCustomers()
  const nav = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { success, data, message }: { success: boolean, data: customers, message: string } = await (await axios.post("/dashboard/people/customers/create-post", {
        fullname,
        email,
        phone,
        update
      })).data;
      if (success && data) {
        setFullname('');
        setEmail('');
        setPhone('');
        setCustomers([data, ..._customers]);
        nav("/dashboard/people/customers");
      }
    } catch (error) {
      console.log(error);

    }
    setLoading(false);
  }

  useEffect(() => {
    if (customer) {
      setFullname(customer.name);
      setEmail(customer.email);
      setPhone(customer.phone);
      setUpdate(customer.id);
    }
  }, [])

  return (
    <Row>
      <Col md={6}>
        <Card title="Create Customer">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Input disabled={loading} value={fullname} onChange={(e) => setFullname(e.target.value)} placeholder="Name" />
            <Input disabled={loading} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" />
            <Input disabled={loading} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" />
            <Space>
              <Button onClick={() => handleSubmit()} disabled={loading} loading={loading} type="primary">
                {update ? "Update" : "Create"}
              </Button>
            </Space>
          </Space>
        </Card>
      </Col>
    </Row>
  );
};

export default CustomerCreatePage;