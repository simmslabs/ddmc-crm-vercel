import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "@remix-run/react";
import { Button, message, Space, Table } from "antd";
import confirm from "antd/lib/modal/confirm";
import axios from "axios";
import moment from "moment";
import { usePurchaseInvoices, useSalesInvoices } from "~/services/hooks";
import { invoicess_type } from "~/services/types";

const PurchaseInvoicePage = () => {
  const [invoices, setInvoices] = usePurchaseInvoices();

  const deleteData = async (data: invoicess_type) => {
    confirm({
      title: `Are you sure delete ${data.invoice_num} ?`, onOk: async () => {
        try {
          const resp = await (await axios.post("/dashboard/purchase/invoice/delete-post", { id: data.id })).data;
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
      <Table title={() => (
        <Space>
          <Link to="create">
            <Button shape="circle" size="small" icon={<PlusOutlined />} />
          </Link>
        </Space>
      )} loading={false} size="small" columns={[
        {
          key: 'invoice_num',
          title: 'No.',
          dataIndex: 'invoice_num'
        },
        {
          key: 'supplier',
          title: 'Supplier',
          dataIndex: 'supplier',
          render: (text, data) => data.supplier && data.supplier.name
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
          dataIndex: 'created_at',
          render: (text, data) => moment(data.created_at).format('LLL')
        },
        {
          key: 'invoice_due',
          title: 'Due Date',
          dataIndex: 'invoice_due',
          render: (text, data) => moment(data.invoice_due).format('LLL')
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
          </Space>)
        }
      ]} dataSource={invoices} />
    </div>
  );
};

export default PurchaseInvoicePage;