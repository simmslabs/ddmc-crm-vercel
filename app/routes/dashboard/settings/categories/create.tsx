import { Button, Card, Input, Space } from "antd";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "@remix-run/react";
import { useCategories, useDepartments, useEmployeePositions } from "~/services/hooks";

const DepartmentCreatePage = () => {

  const nav = useNavigate();

  const [categories, setCategories] = useCategories()
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
        setCategories([data, ...categories]);
        nav("/dashboard/settings/categories");
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <Card>
      <h1>Create Category</h1>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input disabled={loading} onChange={(e) => setTitle(e.target.value)} placeholder="Title of Category" />
        <Button loading={loading} disabled={loading} onClick={() => saveData()}>Save</Button>
      </Space>
    </Card>
  );
};

export default DepartmentCreatePage;