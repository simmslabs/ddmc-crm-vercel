import { CheckOutlined, DeleteOutlined, SaveFilled } from "@ant-design/icons";
import { invoice_items } from "@prisma/client";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { Card, Space, DatePicker, Input, Select, Divider, Row, Col, InputNumber, Button, Checkbox, Table, message as _message } from "antd";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { useCustomers, useInventories, useMediaSizes, useMediaTypes, usePurchaseInvoices, useSalesInvoices, useSuppliers } from "~/services/hooks";
import prisma from "~/services/prisma";
import { inventory_type, invoicess_type } from "~/services/types";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const id = parseInt(url.searchParams.get("id") as string, 10);
  if (id) {
    const invoice = await prisma.invoices.findFirst({
      where: { id },
      include: {
        invoice_items: true
      }
    });
    if (invoice) {
      return json(invoice);
    }
  } else {
    return null;
  }
}

const PurchaseIvoiceCreatePage = () => {
  const invoice = useLoaderData<invoicess_type>();
  const nav = useNavigate();
  const [suppliers,] = useSuppliers();
  const [inventories,] = useInventories();
  const [mediaSizes,] = useMediaSizes();
  const [mediaTypes,] = useMediaTypes();
  const [invoices, setInvoices] = usePurchaseInvoices();

  const [supplier, setSupplier] = useState<number>()
  const [invoiceDateFromTo, setInvoiceDateFromTo] = useState<any>();
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [tax, setTax] = useState(0);



  const [currentQty, setCurrentQty] = useState(1);
  const [currentAmount, setCurrentAmount] = useState(0.00);
  const [currentPrice, setCurrentPrice] = useState(0.00);
  const [currentDiscount, setCurrentDiscount] = useState(0.00);
  const [currentTax, setCurrentTax] = useState(0.00);
  const [currentItemId, setCurrentItemId] = useState<number>();
  const [currentDescription, setCurrentDescription] = useState<string>()
  const [currentMediaType, setCurrentMediaType] = useState<number>();
  const [currentMediaSize, setCurrentMediaSize] = useState<number>();

  const [showDiscount, setShowDiscount] = useState(false);
  const [showMediaType, setShowMediaType] = useState(false);
  const [showMediaSize, setShowMediaSize] = useState(false);

  const [loading, setLoading] = useState(false);
  const [invoiceItems, setInvoiceItems] = useState<{
    inventory_id: number,
    quantity: number,
    amount: number,
    discount: number,
    price: number,
    description: string,
    media_type_id: number,
    media_size_id: number,
  }[]>([]);

  const onItemChange = (e: number) => {
    const item = inventories.find(i => i.id === e);
    if (item) {
      setCurrentPrice((item.sales_price as number) / 100);
      setCurrentItemId(item.id);
      if (item.description) {
        setCurrentDescription(item.description);
      }
    }
  }

  useEffect(() => {
    if (currentQty && currentPrice) {
      setCurrentAmount((currentQty * currentPrice) - currentDiscount);
    }
  }, [currentPrice, currentQty, currentDiscount]);

  const onAddToItems = async () => {
    if (currentItemId) {
      setInvoiceItems([
        ...invoiceItems,
        {
          inventory_id: currentItemId,
          quantity: currentQty,
          amount: currentAmount,
          discount: currentDiscount,
          description: currentDescription as string,
          media_type_id: currentMediaType as number,
          media_size_id: currentMediaSize as number,
          price: currentPrice,
        }
      ]);
      setCurrentItemId(0);
      setCurrentQty(1);
      setCurrentAmount(0.00);
      setCurrentPrice(0.00);
      setCurrentDiscount(0.00);
      setTax(0.00);
      setCurrentDescription("");
      setCurrentMediaType(0);
      setCurrentMediaSize(0);
    }
  }

  const onRemoveItem = (_data: any) => {
    setInvoiceItems(invoiceItems.filter(item => item.inventory_id != _data.inventory_id));
  }

  const saveInvoice = async () => {
    const _data = {
      supplier_id: supplier,
      invoice_items: invoiceItems,
      invoice_date: invoiceDateFromTo[0].toDate(),
      invoice_due: invoiceDateFromTo[1].toDate(),
      order_number: orderNumber,
      tax_amount: tax
    }
    setLoading(true);
    try {
      const { success, message, data } = await (await axios.post("create-post", _data)).data;
      if (success) {
        _message.success(message);
        setInvoiceItems([]);
        setSupplier(0);
        setInvoiceDateFromTo([moment(), moment()]);
        setOrderNumber("");
        setTax(0);
        setInvoices([data, ...invoices]);
        nav("/dashboard/sales/invoice");
      } else {
        _message.error(message);
      }
    } catch (error: any) {
      _message.error(error.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (invoice) {
      if (invoice.supplier_id) {
        setSupplier(invoice.supplier_id);
      }
      if (invoice.invoice_num) {
        setOrderNumber(invoice.invoice_num);
      }
      if (invoice.tax) {
        setTax(invoice.tax);
      }
      if (invoice.invoice_items) {
        setInvoiceItems([...invoice.invoice_items.map(item => ({
          inventory_id: item.inventory_id as number,
          quantity: item.quantity as number,
          amount: item.amount as number,
          discount: item.discount as number,
          description: item.description as string,
          media_type_id: item.media_type_id as number,
          media_size_id: item.media_size_id as number,
          price: item.price as number,
        }))]);
      }
      setInvoiceDateFromTo([moment(invoice.invoice_date), moment(invoice.invoice_due)]);
    }
  }, [invoice]);

  useEffect(() => {
    setOrderNumber(`PUR-${moment().format("YYYYMMDD")}-${Math.floor(Math.random() * 1000)}`);
  }, []);

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Card loading={loading} actions={[
        <Checkbox onChange={(e) => setShowDiscount(e.target.checked)} >Show Discount</Checkbox>,
        <Checkbox onChange={(e) => setShowMediaType(e.target.checked)} >Show Media Type</Checkbox>,
        <Checkbox onChange={(e) => setShowMediaSize(e.target.checked)}>Show Media Size</Checkbox>,
      ]} bordered={false} title={(
        <Space align="center" size="large">
          <h2>Purchase Invoice</h2>
          <Divider type="vertical" />
          {invoiceItems.length > 0 &&
            <Button onClick={(e) => saveInvoice()} color="green" icon={<SaveFilled />}>Save Invoice</Button>
          }
        </Space>
      )}>
        <Row gutter={5} align="middle">
          <Col flex="auto">
            <DatePicker.RangePicker value={invoiceDateFromTo} onChange={(e) => setInvoiceDateFromTo(e)} style={{ width: "100%" }} />
          </Col>
          <Col flex="auto">
            <Input value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="Invoice Number" />
          </Col>
        </Row>
        <Divider />
        <Row gutter={5}>
          <Col md={6}>
            <label>Supplier</label>
            <Select showSearch value={supplier} onChange={(e) => setSupplier(e)} filterOption={(input, option) =>
              (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
            } style={{ width: "100%" }} placeholder="Select Supplier">
              <Select.Option value={0}>Select Customer</Select.Option>
              {suppliers.map(supplier => (
                <Select.Option key={supplier.id} value={supplier.id}>{supplier.name}</Select.Option>
              ))}
            </Select>
          </Col>
          <Col md={6}>
            <Col flex="auto">
              <label>Tax</label>
              <InputNumber style={{ width: "100%" }} placeholder="Tax" onChange={(e) => setTax(e)} value={tax} />
            </Col>
          </Col>
        </Row>
        <Divider />
        <Row gutter={5} align="middle">
          <Col flex="auto">
            <label>Item</label>
            <Select showSearch value={currentItemId} filterOption={(input, option) =>
              (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
            } style={{ width: "100%" }} onChange={onItemChange} placeholder="Select Item">
              <Select.Option value={0}>Select Item</Select.Option>
              {inventories.map(inventory => (
                <Select.Option key={inventory.id} value={inventory.id}>{inventory.title}</Select.Option>
              ))}
            </Select>
          </Col>
          <Col flex="auto">
            <label>Quantity</label>
            <InputNumber style={{ width: "100%" }} placeholder="Quantity" onChange={(e) => setCurrentQty(e)} value={currentQty} />
          </Col>
          <Col flex="auto">
            <label>Price</label>
            <InputNumber style={{ width: "100%" }} placeholder="Price" onChange={(e) => setCurrentPrice(e)} value={currentPrice} />
          </Col>
          {showMediaSize && (
            <Col flex="auto">
              <label>Media Size</label>
              <Select value={currentMediaSize} onChange={(e) => setCurrentMediaSize(e)} style={{ width: "100%" }}>
                {mediaSizes.map(mediaSize => (
                  <Select.Option key={mediaSize.id} value={mediaSize.id}>{mediaSize.title}</Select.Option>
                ))}
              </Select>
            </Col>
          )}
          {showMediaType && (
            <Col flex="auto">
              <label>Media Type</label>
              <Select value={currentMediaType} onChange={(e) => setCurrentMediaType(e)} style={{ width: "100%" }}>
                {mediaTypes.map(mediaType => (
                  <Select.Option key={mediaType.id} value={mediaType.id}>{mediaType.title}</Select.Option>
                ))}
              </Select>
            </Col>
          )}
          {showDiscount && (
            <Col flex="auto">
              <label>Discount</label>
              <InputNumber style={{ width: "100%" }} placeholder="Discount" onChange={(e) => setCurrentDiscount(e)} value={currentDiscount} />
            </Col>
          )}
          <Col flex="auto">
            <label>Amount</label>
            <InputNumber disabled style={{ width: "100%" }} placeholder="Amount" value={currentAmount} />
          </Col>
          <Col flex="auto">
            <Button onClick={() => onAddToItems()} icon={<CheckOutlined />} shape="circle" />
          </Col>
        </Row>
      </Card>
      {invoiceItems.length > 0 && (
        <Table rowKey="id" columns={[
          {
            title: 'Item',
            dataIndex: 'description'
          },
          {
            title: 'Quantity',
            dataIndex: 'quantity'
          },
          showDiscount ? {
            title: 'Discount',
            dataIndex: 'discount'
          } : {},
          {
            title: 'Price',
            dataIndex: 'price'
          },
          {
            title: 'Amount',
            dataIndex: 'amount'
          },
          {
            title: 'Action',
            dataIndex: 'action',
            render: (text, record) => (
              <Space size="middle">
                <Button icon={<DeleteOutlined />} onClick={() => onRemoveItem(record)} />
              </Space>
            )
          }
        ]} dataSource={invoiceItems} footer={(data) => (
          <Row gutter={5}>
            <Col flex="auto">
              <label>Total</label>
              <InputNumber disabled style={{ width: "100%" }} placeholder="Total" value={data.reduce((a, b) => (a + b.amount), 0) as number} />
            </Col>
          </Row>
        )} />
      )}
    </Space>
  );
};

export default PurchaseIvoiceCreatePage;