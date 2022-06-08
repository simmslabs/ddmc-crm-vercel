import { Button, Card, Input, Space } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useAccounts, useBrands } from "~/services/hooks";
import TextArea from "antd/lib/input/TextArea";
import { LoaderFunction } from "@remix-run/node";
import prisma from "~/services/prisma";
import { accounts } from "@prisma/client";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  if (url.searchParams.has("id")) {
    const id = parseInt(url.searchParams.get("id") as string, 10);
    const accounts = await prisma.accounts.findFirst({ where: { id } });
    if (accounts) {
      return accounts;
    }
  } else {
    return null;
  }
}

const DepartmentCreatePage = () => {

  const edit_data = useLoaderData<accounts>();
  const nav = useNavigate();

  const [accounts, setAccounts] = useAccounts()
  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [update, setUpdate] = useState<number | null>(0);
  const [loading, setLoading] = useState(false);

  const saveData = async () => {
    setLoading(true);
    try {
      const { success, message, data } = await (await axios.post("create-post", {
        title,
        description,
        update
      })).data;
      if (success && data) {
        setTitle('');
        setDescription('');
        if (update) {
          setAccounts(accounts.filter(account => account.id === data.id ? data : account));
        } else {
          setAccounts([data, ...accounts]);
        }
        nav("/dashboard/settings/accounts");
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (edit_data) {
      setTitle(edit_data.name);
      setDescription(edit_data.description);
      setUpdate(edit_data.id);
    }
  }, []);

  return (
    <Card>
      <h1>Create Account</h1>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input disabled={loading} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title of Account" />
        <TextArea disabled={loading} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <Button loading={loading} disabled={loading} onClick={() => saveData()}>{update ? 'Update' : 'Save'}</Button>
      </Space>
    </Card>
  );
};

export default DepartmentCreatePage;