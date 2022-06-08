import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "@remix-run/react";
import { Badge, Button, message, Space, Table } from "antd";
import confirm from "antd/lib/modal/confirm";
import axios from "axios";
import { useState } from "react";
import { useProjects } from "~/services/hooks";
import { projects_type } from "~/services/types";

const ProjectsPage = () => {
  const [projects, setProjects] = useProjects();
  const [loading, setLoading] = useState(false);

  const deleteItem = async (_data: projects_type) => {
    confirm({
      title: `Are you sure delete ${_data.project_title} ?`, onOk: async () => {
        setLoading(true);
        try {
          const resp = await (await axios.post("/dashboard/projects/delete-post", { id: _data.id })).data;
          if (resp) {
            setProjects(projects.filter(p => p.id !== resp.id));
          }
        } catch (error: any) {
          message.error(error.message);
        }
        setLoading(false);
      }
    });
  }

  return (
    <Table title={() => <Space align="center">
      <div style={{ fontSize: 20, fontWeight: 'bold' }}>Projects</div>
      <Link to="create">
        <Button shape="circle" size="small" icon={<PlusOutlined />} ></Button>
      </Link>
    </Space>}
      columns={[
        {
          title: "Title",
          dataIndex: "project_title",
        },
        {
          title: "Customer",
          dataIndex: "customer",
          render: (text, data) => {
            return data.customer.name;
          }
        },
        {
          title: "Category",
          dataIndex: "category",
          render: (text, data) => {
            return data.category.title;
          }
        },
        {
          title: "Invoice",
          dataIndex: "invoice",
          render: (text, data) => {
            return data.invoice && data.invoice.invoice_num;
          }
        },
        {
          title: "Status",
          dataIndex: "status",
        },
        {
          title: "Start Date",
          dataIndex: "start_date",
        },
        {
          title: "End Date",
          dataIndex: "due_date",
        },
        {
          title: "Tasks",
          dataIndex: "tasks",
          render: (text, data) => (<Badge title="Tasks">{data.tasks.length}</Badge>)
        },
        {
          title: "Actions",
          dataIndex: "actions",
          render: (t, data) => (<Space>
            <Link to={`create?id=${data.id}`}>
              <Button shape="circle" size="small" icon={<EditOutlined />} />
            </Link>
            <Button loading={loading} onClick={() => deleteItem(data)} size="small" icon={<DeleteOutlined />} shape="circle" />
          </Space>)
        }
      ]}
      dataSource={projects}
    />
  );
};

export default ProjectsPage;