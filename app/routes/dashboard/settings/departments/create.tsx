import { useNavigate } from "@remix-run/react";
import { Button, Card, Input, Space } from "antd";
import axios from "axios";
import { useState } from "react";
import { useDepartments } from "~/services/hooks";

const DepartmentCreatePage = () => {

  const [departments, setDepartments] = useDepartments()
  const [title, setTitle] = useState<string>();
  const [update, setUpdate] = useState<number | null>();
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const saveData = async () => {
    setLoading(true);
    try {
      const { success, message, data } = await (await axios.post("create-post", {
        title,
      })).data;
      if (success && data) {
        setTitle('');
        setDepartments([data, ...departments]);
        nav("/dashboard/settings/departments");
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <Card>
      <h1>Create Department</h1>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input disabled={loading} onChange={(e) => setTitle(e.target.value)} placeholder="Title of Department" />
        <Button loading={loading} disabled={loading} onClick={() => saveData()}>Save</Button>
      </Space>
    </Card>
  );
};

export default DepartmentCreatePage;