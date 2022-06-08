import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Label } from "@fluentui/react";
import { project_tasks } from "@prisma/client";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { Button, Card, Col, DatePicker, Divider, Input, Row, Select, Space, message as _message, Table } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { ColumnsType } from "antd/lib/table";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { LoaderFunction } from "remix";
import { useCustomers, useEmployees, useProjectCategories, useProjects, useSalesInvoices } from "~/services/hooks";
import prisma from "~/services/prisma";
import { projects_type } from "~/services/types";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  if (url.searchParams.has("id")) {
    const id = parseInt(url.searchParams.get("id") as string, 10);
    const projects = await prisma.projects.findFirst({
      where: { id }, include: {
        customer: true,
        category: true,
        invoice: true,
        tasks: true
      }
    });
    if (projects) {
      return projects;
    } else {
      return null;
    }
  } else {
    return null;
  }
}

const ProjectCreatePage = () => {

  const project = useLoaderData<projects_type>();

  const [customers,] = useCustomers();
  const [employees, setEmployees] = useEmployees();
  const [projects, setProjects] = useProjects();
  const [projectCategories, setProjectCategories] = useProjectCategories();
  const [invoices,] = useSalesInvoices();
  const nav = useNavigate();

  const [loading, setLoading] = useState(false);

  const [openTask, setOpenTask] = useState(false);

  const [update, setUpdate] = useState<number>();
  const [status, setStatus] = useState<string>('stopped');
  const [customer, setCustomer] = useState<number>();
  const [title, setTitle] = useState('');
  const [startDue, setStartDue] = useState<any>();
  const [invoice, setInvoice] = useState<number>();
  const [notes, setNotes] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [projectCategory, setProjectCategory] = useState<number>();

  const [tasks, setTasks] = useState<project_tasks[]>([]);
  const [currentTaskTitle, setCurrentTaskTitle] = useState<string>();
  const [currentTaskStartDueDate, setCurrentTaskStartDueDate] = useState<any>();
  const [employee, setEmployee] = useState<number>();
  const [currentTaskNote, setCurrentTaskNote] = useState<string>('');
  const [currentTaskComment, setCurrentTaskComment] = useState<string>('');


  const _setInvoice = (e: number) => {
    const invoice = invoices.filter(invoice => invoice.id === e);
    if (invoice.length > 0) {
      setCustomer(invoice[0].customer.id);
      setInvoice(invoice[0].id);
    }
  }

  const saveData = async () => {
    setLoading(true);
    try {
      if (title && customer && startDue && invoice && projectCategory) {
        const { success, message, data } = await (await axios.post("create-post", {
          customer_id: customer,
          title,
          start_date: startDue[0],
          due_date: startDue[1],
          invoice_id: invoice,
          project_category_id: projectCategory,
          notes,
          note: notes,
          comment,
          update,
          status,
          tasks
        })).data;
        if (success && data) {
          setTitle('');
          setCustomer(undefined);
          setInvoice(undefined);
          setStartDue(undefined);
          setNotes('');
          setComment('');
          setStatus('stopped');
          if (!update) {
            setProjects([data, ...projects]);
          } else {
            setProjects([...projects.filter(project => project.id === data.id ? data : project)]);
          }

          _message.success(message);
          nav("/dashboard/projects");
        } else {
          _message.error(message);
        }
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  const addToTask = () => {
    if (currentTaskTitle && employee && currentTaskStartDueDate) {
      setTasks([...tasks, {
        id: 0,
        task_title: currentTaskTitle,
        employee_id: employee,
        start_date: currentTaskStartDueDate[0],
        due_date: currentTaskStartDueDate[1],
        note: currentTaskNote,
        comment: currentTaskComment,
        created_at: null,
        updated_at: null,
        project_id: null
      }]);
      setCurrentTaskTitle('');
      setCurrentTaskStartDueDate(undefined);
      setEmployee(undefined);
      setCurrentTaskNote('');
      setCurrentTaskComment('');
    }
  }

  useEffect(() => {
    if (project) {
      setTitle(project.project_title);
      setCustomer(project.customer.id);
      if (project.invoice) {
        setInvoice(project.invoice.id);
      }
      setStartDue([moment(project.start_date), moment(project.due_date)]);
      setNotes(project.note);
      setComment(project.comment);
      setProjectCategory(project.category.id);
      setUpdate(project.id);
      setStatus(project.status);
      setTasks(project.tasks);
    }
  }, []);

  return (
    <Card>
      <Row>
        <Col md={12}>
          <Space direction="vertical">
            <Label>Select Customer</Label>
            <Select disabled={loading} value={customer} onChange={(e) => setCustomer(e)} style={{ width: '100%' }}>
              <Select.Option value={undefined}> </Select.Option>
              {customers.map((customer) => (<Select.Option value={customer.id}>{customer.name}</Select.Option>))}
            </Select>
            <Label>Select Project  Category</Label>
            <Select disabled={loading} value={projectCategory} onChange={(e) => setProjectCategory(e)} style={{ width: '100%' }}>
              <Select.Option value={undefined}> </Select.Option>
              {projectCategories.map((customer) => (<Select.Option value={customer.id}>{customer.title}</Select.Option>))}
            </Select>
            <Label>Project Deadline</Label>
            <DatePicker.RangePicker disabled={loading} value={startDue} onChange={(e) => setStartDue(e)} />
            <Divider />
            <Label>Project Title</Label>
            <Input disabled={loading} value={title} onChange={(e) => setTitle(e.target.value)} />
            <Label>Project Invoice</Label>
            <Select disabled={loading} value={invoice} onChange={(e) => _setInvoice(e)} style={{ width: '100%' }}>
              <Select.Option value={undefined}> </Select.Option>
              {invoices.map((invoice) => (<Select.Option value={invoice.id}>{invoice.invoice_num}</Select.Option>))}
            </Select>
            <Label>Project Note</Label>
            <TextArea disabled={loading} value={notes} onChange={(e) => setNotes(e.target.value)} />
            <Label>Project Comment</Label>
            <TextArea disabled={loading} value={comment} onChange={(e) => setComment(e.target.value)} />
            <Divider />
            <Select disabled={loading} value={status} onChange={(e) => setStatus(e)} style={{ width: '100%' }}>
              <Select.Option value={undefined}> </Select.Option>
              <Select.Option value='stopped'>Stopped</Select.Option>
              <Select.Option value='ongoing'>Ongoing</Select.Option>
              <Select.Option value='completed'>Completed</Select.Option>
            </Select>
            <Divider />
            <Button disabled={loading} loading={loading} onClick={() => saveData()}  >Save</Button>
          </Space>
        </Col>
        <Col md={12}>
          <Card title={<Space>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
              Tasks
            </div>
            <Button onClick={() => setOpenTask((o) => !o)} size="small" icon={<PlusOutlined />} shape="circle" />
          </Space>}>
            {openTask && (
              <Space style={{ width: '100%' }} direction="vertical">
                <Label>Task Title</Label>
                <Input value={currentTaskTitle} onChange={(e) => setCurrentTaskTitle(e.target.value)} style={{ width: '100%' }} />
                <DatePicker.RangePicker value={currentTaskStartDueDate} onChange={(e) => setCurrentTaskStartDueDate(e)} style={{ width: '100%' }} />
                <Label>Employee</Label>
                <Select style={{ width: '100%' }} value={employee} onChange={(e) => setEmployee(e)}>
                  <Select.Option value={undefined}> </Select.Option>
                  {employees.map((e) => (<Select.Option value={e.id}>{e.name}</Select.Option>))}
                </Select>
                <Label>Notes</Label>
                <TextArea value={currentTaskNote} onChange={(e) => setCurrentTaskNote(e.target.value)} />
                <Label>Comments</Label>
                <TextArea value={currentTaskComment} onChange={(e) => setCurrentTaskComment(e.target.value)} />
                <Button onClick={(e) => addToTask()} icon={<PlusOutlined />}>Add Task</Button>
              </Space>
            )}
            {tasks.length > 0 && (<Table showHeader={false} dataSource={tasks} columns={[
              {
                title: 'Task',
                dataIndex: 'task_title'
              },
              {
                title: 'Employee',
                dataIndex: 'employee_id',
                render: (e) => {
                  const emp = employees.find((employee) => employee && employee.id == e);
                  if (emp) {
                    return emp.name;
                  }
                }
              },
              {
                title: 'Start Date',
                dataIndex: 'start_date',
                render: (e) => moment(e).format('DD/MM/YYYY')
              },
              {
                title: 'Due Date',
                dataIndex: 'due_date',
                render: (e) => moment(e).format('DD/MM/YYYY')
              },
              {
                title: 'Action',
                render: (e, data) => (
                  <Space>
                    <Button icon={<DeleteOutlined />} size="small" onClick={(e) => setTasks(tasks.filter(t => t.task_title !== data.task_title))} />
                  </Space>
                )
              }
            ]} />)}
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default ProjectCreatePage;