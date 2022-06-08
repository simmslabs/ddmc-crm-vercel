import { DownloadOutlined, EditOutlined, SendOutlined } from "@ant-design/icons";
import { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Button, Card, Col, Row, Space, Table } from "antd";
import { useEffect, useState } from "react";
import prisma from "~/services/prisma";
import { invoicess_type } from "~/services/types";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { parseInvoice } from "~/services/hooks";
import InvoicePaymentCard from "~/components/InvoicePaymentCard";

export const loader: LoaderFunction = async ({ params }) => {
  if (params.id) {
    const invoice = await prisma.invoices.findFirst({
      where: { id: parseInt(params.id, 10) }, include: {
        customer: true,
        invoice_items: true,
        projects: true,
        receipts: true,
        supplier: true,
        user: true
      }
    });
    if (invoice) {
      return invoice;
    }
  }
}

const ViewSalesInvoice = () => {
  const invoice_ = useLoaderData<invoicess_type>();
  const [invoice, setInvoice] = useState<invoicess_type>();
  const [parsed, setParsed] = useState<any | null>(null);

  const savePDF = async () => {
    const el = document.querySelector(".main .ant-card-body") as HTMLElement;
    const doc = new jsPDF('p', 'mm', 'a4');
    if (el) {
      const canv = await html2canvas(el);
      canv.toBlob((b) => {
        if (b) {
          const url = URL.createObjectURL(b);
          window.open(url, '_blank');
        }
      });
      // console.log(canv.toBlob());

      // doc.addImage(canv.toDataURL('image/jpg', 100), 'JPEG', 0, 0, el.clientWidth, el.clientHeight);

      // doc.save('invoice.pdf');
    }
  }

  useEffect(() => {
    if (invoice_) {
      setInvoice(invoice_);
      setParsed({ ...parseInvoice(invoice_) });
    }
  }, [invoice_]);
  return (
    <Row style={{ backgroundColor: '#eee', height: '100vh' }} justify="center">
      {invoice && (
        <Col md={12}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Card className="main" title={<Space>
              <Button onClick={() => savePDF()} icon={<DownloadOutlined />}>Download</Button>
              <Button icon={<SendOutlined />}>Send</Button>
              <Link to={`/dashboard/sales/invoice/create?id=${invoice.id}`}>
                <Button icon={<EditOutlined />}>Edit</Button>
              </Link>
            </Space>} style={{ marginBottom: '20px', marginTop: '20px' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <h2 style={{ fontWeight: 'bold' }}>{invoice.invoice_num}</h2>
                <Row style={{ width: '100%' }} gutter={10}>
                  <Col md={12}>
                    <Card style={{ width: '100%' }}>
                      {invoice.customer && (<div>
                        <h3 style={{ fontWeight: 'bold' }}>Invoice For</h3>
                        {invoice.customer.name && (<div>{invoice.customer.name}</div>)}
                        {invoice.customer.email && (<div>{invoice.customer.email}</div>)}
                        {invoice.customer.phone && (<div>{invoice.customer.phone}</div>)}
                      </div>)}
                    </Card>
                  </Col>
                </Row>
                <Table pagination={false} columns={[
                  {
                    title: "Description",
                    dataIndex: "description",
                    key: "description",
                  },
                  {
                    title: "Quantity",
                    dataIndex: "quantity",
                    key: "quantity",
                    align: "right",
                  },
                  {
                    title: "Unit Price",
                    dataIndex: "price",
                    key: "price",
                    align: "right",
                  },
                  {
                    title: "Discount",
                    dataIndex: "discount",
                    key: "discount",
                    align: "right",
                    render: (txt, invoice) => {
                      return <span>{invoice.discount && -Math.abs(invoice.discount)}</span>
                    }
                  },
                  {
                    title: "Total",
                    dataIndex: "amount",
                    key: "total",
                  }
                ]} dataSource={invoice.invoice_items} footer={(inv) => {
                  const parsedData = parseInvoice(invoice);
                  return (
                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <Space align="end" style={{ width: "100%" }}>
                              <h1>Total</h1>
                              <h1 style={{ fontWeight: 'bold' }}>{parsedData.amount()}</h1>
                            </Space>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )
                }
                } />
              </Space>
            </Card>
            <InvoicePaymentCard invoice={invoice} />
          </Space>
        </Col>
      )
      }
    </Row >
  );
}

export default ViewSalesInvoice;