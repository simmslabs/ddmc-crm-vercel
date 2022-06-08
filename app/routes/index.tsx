import { LoginOutlined } from "@ant-design/icons";
import { useNavigate } from "@remix-run/react";
import { Button, Card, Col, Input, Row, Space, message as _message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSession } from "~/services/hooks";

const PageIndex = () => {

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const [session, setSession] = useSession();
  const nav = useNavigate();

  const loginUser = async () => {
    setLoading(true);
    try {
      const { success, data, message } = await (await axios.post("/action/login", {
        email,
        password
      })).data;
      if (success) {
        setSession(data);
        window.location.href = "/dashboard";
      } else {
        _message.error(message);
      }
    } catch (error: any) {
      _message.error(error.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (session) {
      window.location.href = "/dashboard";
    }
  }, [session]);

  return (
    <Row justify="center">
      <Col md={4} style={{ marginTop: 50 }}>
        <Card>
          <Space direction="vertical" style={{ width: '100%' }}>
            <h2>Login</h2>
            <span style={{ color: '#ccc' }}>Enter your valid credentials below.</span>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
            <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
            <Button loading={loading} onClick={() => loginUser()} icon={<LoginOutlined />}>Login</Button>
          </Space>
        </Card>
      </Col>
    </Row>
  );
}

export default PageIndex;