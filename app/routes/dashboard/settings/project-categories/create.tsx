import { Button, Card, Input, Space } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useAccounts, useBrands, useProjectCategories } from "~/services/hooks";
import TextArea from "antd/lib/input/TextArea";
import { LoaderFunction } from "@remix-run/node";
import prisma from "~/services/prisma";
import { project_categories } from "@prisma/client";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  if (url.searchParams.has("id")) {
    const id = parseInt(url.searchParams.get("id") as string, 10);
    const accounts = await prisma.project_categories.findFirst({ where: { id } });
    if (accounts) {
      return accounts;
    }
  } else {
    return null;
  }
}

const DepartmentCreatePage = () => {

  const edit_data = useLoaderData();
  const nav = useNavigate();

  const [projectCategories, setProjectCategories] = useProjectCategories()
  const [title, setTitle] = useState<string>();
  const [update, setUpdate] = useState<number | null>(0);
  const [loading, setLoading] = useState(false);

  const saveData = async () => {
    setLoading(true);
    try {
      const { success, message, data } = await (await axios.post("create-post", {
        title,
        update
      })).data;
      if (success && data) {
        setTitle('');
        if (update) {
          setProjectCategories(projectCategories.filter(account => account.id === data.id ? data : account));
        } else {
          setProjectCategories([data, ...projectCategories]);
        }
        nav("/dashboard/settings/project-categories");
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (edit_data) {
      setTitle(edit_data.title);
      setUpdate(edit_data.id);
    }
  }, []);

  return (
    <Card title="Create Project Category">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input disabled={loading} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title of Project Category" />
        <Button loading={loading} disabled={loading} onClick={() => saveData()}>{update ? 'Update' : 'Save'}</Button>
      </Space>
    </Card>
  );
};

export default DepartmentCreatePage;