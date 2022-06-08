import { customers, suppliers } from "@prisma/client";
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { Button, Card, Col, Grid, Input, Row, Space } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useCustomers, useSuppliers } from "~/services/hooks";
import prisma from "~/services/prisma";

export const loader: LoaderFunction = ({ request }) => {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);
  const edit = params.get("edit");
  if (edit) {
    const supplier = prisma.suppliers.findFirst({ where: { id: parseInt(edit) } });
    return supplier;
  }
  return null;
}

const CustomerCreatePage = () => {

  const supplier = useLoaderData<suppliers | null>();

  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState<number | null>();
  const [_suppliers, setSuppliers] = useSuppliers()
  const nav = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { success, data, message }: { success: boolean, data: customers, message: string } = await (await axios.post("/dashboard/people/suppliers/create-post", {
        fullname,
        email,
        phone,
        update
      })).data;
      if (success && data) {
        setFullname('');
        setEmail('');
        setPhone('');
        setSuppliers([data, ..._suppliers]);
        nav("/dashboard/people/suppliers");
      }
    } catch (error) {
      console.log(error);

    }
    setLoading(false);
  }

  useEffect(() => {
    if (supplier) {
      setFullname(supplier.name);
      setEmail(supplier.email);
      setPhone(supplier.phone);
      setUpdate(supplier.id);
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