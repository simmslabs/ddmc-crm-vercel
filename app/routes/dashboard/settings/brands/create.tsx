import { Button, Card, Input, Space } from "antd";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "@remix-run/react";
import { useBrands } from "~/services/hooks";

const DepartmentCreatePage = () => {

  const nav = useNavigate();

  const [brands, setBrands] = useBrands()
  const [title, setTitle] = useState<string>();
  const [update, setUpdate] = useState<number | null>();
  const [loading, setLoading] = useState(false);

  const saveData = async () => {
    setLoading(true);
    try {
      const { success, message, data } = await (await axios.post("create-post", {
        title,
      })).data;
      if (success && data) {
        setTitle('');
        setBrands([data, ...brands]);
        nav("/dashboard/settings/brands");
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <Card>
      <h1>Create Brand</h1>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input disabled={loading} onChange={(e) => setTitle(e.target.value)} placeholder="Title of Brand" />
        <Button loading={loading} disabled={loading} onClick={() => saveData()}>Save</Button>
      </Space>
    </Card>
  );
};

export default DepartmentCreatePage;