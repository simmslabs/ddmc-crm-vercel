import { permissions, roles, role_has_permissions } from "@prisma/client";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { Badge, Button, Card, Checkbox, Input, Space, Table } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { LoaderFunction } from "remix";
import { useDepartments, useEmployeePositions, usePermissions, useRoles } from "~/services/hooks";
import prisma from "~/services/prisma";

export const loader: LoaderFunction = ({ request }) => {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);
  const edit = params.get("id");
  if (edit) {
    const roles = prisma.roles.findFirst({ where: { id: parseInt(edit) }, include: { role_permissions: true } });
    return roles;
  }
  return null;
}

const RolesCreatePage = () => {

  const _roles = useLoaderData<roles & { role_permissions: role_has_permissions[] }>();

  const [roles, setRoles] = useRoles()
  const [title, setTitle] = useState<string>();
  const [id, setId] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = usePermissions();
  const [views, setViews] = useState<permissions[]>([]);
  const [creates, setCreates] = useState<permissions[]>([]);
  const [deletes, setDeletes] = useState<permissions[]>([]);
  const [currentPerms, setCurrentPerms] = useState<number[]>([]);

  const nav = useNavigate();

  const saveData = async () => {
    console.log(currentPerms);

    setLoading(true);
    try {
      const { success, message, data } = await (await axios.post("create-post", {
        title,
        permissions: currentPerms,
        id
      })).data;
      if (success && data) {
        setTitle('');
        setRoles([data, ...roles]);
        nav("/dashboard/settings/roles");
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (permissions) {
      setViews(permissions.filter(p => p.name.includes("view ")));
      setCreates(permissions.filter(p => p.name.includes("create ")));
      setDeletes(permissions.filter(p => p.name.includes("delete ")));
    }
  }, [permissions]);

  const addToPermissions = (val: number) => {
    if (currentPerms.includes(val)) {
      setCurrentPerms(currentPerms.filter(p => p !== val));
    } else {
      setCurrentPerms([...currentPerms, val]);
    }
  }

  useEffect(() => {
    if (_roles) {
      setTitle(_roles.name);
      setId(_roles.id);
      setCurrentPerms(_roles.role_permissions.map((p: any) => p.permission_id));
    }
  }, []);

  return (
    <Card>
      <h1>Add Role</h1>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input value={title} disabled={loading} onChange={(e) => setTitle(e.target.value)} placeholder="Title of Role" />
        <Button loading={loading} disabled={loading} onClick={() => saveData()}>{_roles ? "Update" : "Save"}</Button>
      </Space>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Table pagination={false} showHeader={false} title={() => <Badge status="processing" ><h1>View</h1></Badge>} columns={[
          { title: 'Name', dataIndex: 'name', key: 'name' },
          { title: '', dataIndex: '', key: 'id', render: (t, r) => <Checkbox checked={currentPerms.includes(r.id)} onChange={(e) => addToPermissions(e.target.value)} value={r.id} /> },
        ]} dataSource={views.map(v => {
          return {
            name: v.name.split(" ")[1].replace("_", " ").toUpperCase(),
            id: v.id,
          }
        })} />
        <Table pagination={false} showHeader={false} title={() => <Badge status="processing" ><h1>Create</h1></Badge>} columns={[
          { title: 'Name', dataIndex: 'name', key: 'name' },
          { title: '', dataIndex: '', key: 'id', render: (t, r) => <Checkbox checked={currentPerms.includes(r.id)} onChange={(e) => addToPermissions(e.target.value)} value={r.id} /> },
        ]} dataSource={creates.map(v => {
          return {
            name: v.name.split(" ")[1].replace("_", " ").toUpperCase(),
            id: v.id,
          }
        })} />
        <Table pagination={false} showHeader={false} title={() => <Badge status="processing" ><h1>Delete</h1></Badge>} columns={[
          { title: 'Name', dataIndex: 'name', key: 'name' },
          { title: '', dataIndex: '', key: 'id', render: (t, r) => <Checkbox checked={currentPerms.includes(r.id)} onChange={(e) => addToPermissions(e.target.value)} value={r.id} /> },
        ]} dataSource={deletes.map(v => {
          return {
            name: v.name.split(" ")[1].replace("_", " ").toUpperCase(),
            id: v.id,
          }
        })} />
      </Space>
    </Card>
  );
};

export default RolesCreatePage;