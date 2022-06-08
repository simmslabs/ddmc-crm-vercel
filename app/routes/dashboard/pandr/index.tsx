import { receipts } from "@prisma/client";
import { Badge, DatePicker, Select, Space, Table } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { usePaymentsAndReceipts } from "~/services/hooks";

const PaymentsAndReceipts = () => {

  const [receipts, setReceipts] = usePaymentsAndReceipts();

  useEffect(() => {
    console.log(receipts);

  }, [receipts]);

  return (
    <Table title={() => (<Space size="large">
      <Select>
        <Select.Option>All</Select.Option>
        <Select.Option>Purchase</Select.Option>
        <Select.Option>Sales</Select.Option>
      </Select>
      <DatePicker.RangePicker />
    </Space>)} dataSource={receipts} columns={[
      {
        title: 'Invoice No.',
        dataIndex: 'invoice_num',
        key: 'invoice_num'
      },
      {
        title: 'Date',
        dataIndex: 'invoice_date',
        key: 'invoice_date',
        render: (text, data) => moment(data.invoice_date).format('MM DD, YYYY')
      },
      {
        title: 'Customer / Supplier',
        dataIndex: 'customer',
        key: 'customer',
        render: (text, data) => {
          if (data.customer) {
            return data.customer.name;
          }
          if (data.supplier) {
            return data.supplier.name;
          }
        }
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        render: (text, data) => {
          return <Badge status={data.type === 'purchase' ? 'success' : 'warning'} text={data.type} />
        }
      },
      {
        title: 'Invoice Amount',
        dataIndex: 'amount',
        key: 'amount',
        render: (text, data) => {
          if (data.total_amount) {
            return data.total_amount / 100;
          } else {
            return 0;
          }
        }
      },
      {
        title: 'Payment Amount',
        dataIndex: 'payment_amount',
        key: 'payment_amount',
        render: (text, data) => {
          if (data.receipts.length > 0) {
            const receipts = data.receipts;
            const total = receipts.reduce((acc, cur) => acc + cur.amount, 0);
            return total / 100;
          } else {
            return 0;
          }
        }
      },
      {
        title: 'Balance',
        dataIndex: 'balance',
        key: 'balance',
        render: (text, data) => {
          let tm = 0;
          const receipts: receipts[] = data.receipts;
          if (data.total_amount) {
            tm = data.total_amount / 100;
          }
          const total = receipts.reduce((acc, cur) => acc + cur.amount, 0);
          return tm - (total / 100);
        }
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (text, data) => {
          let tm = 0;
          const receipts: receipts[] = data.receipts;
          if (data.total_amount) {
            tm = data.total_amount / 100;
          }
          const total = receipts.reduce((acc, cur) => acc + cur.amount, 0);
          return tm > 0 && tm - (total / 100) === 0 ? <Badge status="success" text="Paid" /> : <Badge status="error" text="Unpaid" />
        }
      }
    ]} />
  );
};

export default PaymentsAndReceipts;