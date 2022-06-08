import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "@remix-run/react";
import { Badge, Button, message, Space, Table } from "antd";
import confirm from "antd/lib/modal/confirm";
import axios from "axios";
import moment from "moment";
import { parseInvoice, useSalesInvoices } from "~/services/hooks";
import { invoicess_type } from "~/services/types";

const SalesInvoicePage = () => {
  const [invoices, setInvoices] = useSalesInvoices();

  const deleteData = async (data: invoicess_type) => {
    confirm({
      title: `Are you sure delete ${data.invoice_num} ?`, onOk: async () => {
        try {
          const resp = await (await axios.post("/dashboard/sales/invoice/delete-post", { id: data.id })).data;
          if (resp.id) {
            setInvoices(invoices.filter(i => i.id !== resp.id));
          }
        } catch (error: any) {
          message.error(error.message);
        }
      }
    });
  }

  return (
    <div>
      <Table title={() => <Space>
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
          Invoice
        </div>
        <Link to="create">
          <Button size="small" shape="circle" icon={<PlusOutlined />} />
        </Link>
      </Space>} loading={false} size="small" columns={[
        {
          key: 'invoice_num',
          title: 'No.',
          dataIndex: 'invoice_num'
        },
        {
          key: 'customer',
          title: 'Customer',
          dataIndex: 'customer',
          render: (text, data) => data.customer && data.customer.name
        },
        {
          key: 'user',
          title: 'User',
          dataIndex: 'user',
          render: (text, data) => data.user && data.user.name
        },
        {
          key: 'date',
          title: 'Date',
          dataIndex: 'invoice_date',
          render: (text, data) => moment(data.invoice_date).format('DD MM, Y')
        },
        {
          key: 'invoice_due',
          title: 'Due Date',
          dataIndex: 'invoice_due',
          render: (text, data) => moment(data.invoice_due).format('LLL')
        },
        {
          key: 'status',
          title: 'Status',
          dataIndex: 'status',
          render: (text, data) => {
            const inv = parseInvoice(data);
            if (inv.is_paid()) {
              return <Badge status="success" text="Paid" />
            } else {
              return <Badge status="processing" text="Unpaid" />
            }
          }
        },
        {
          key: 'action',
          title: 'Action',
          dataIndex: 'action',
          render: (text, data) => (<Space>
            <Button shape="circle" onClick={(e) => deleteData(data)} size="small" icon={<DeleteOutlined />} />
            <Link to={`create?id=${data.id}`}>
              <Button shape="circle" size="small" icon={<EditOutlined />} />
            </Link>
            <Link to={`view/${data.id}`}>
              <Button shape="circle" size="small" icon={<EyeOutlined />} />
            </Link>
          </Space>)
        }
      ]} dataSource={invoices} />
    </div>
  );
};

export default SalesInvoicePage;