import { Button, Card, InputNumber, List, message, Space } from "antd";
import confirm from "antd/lib/modal/confirm";
import axios from "axios";
import { useEffect, useState } from "react";
import { parseInvoice, useSalesInvoices, useSession } from "~/services/hooks";
import { invoicess_type } from "~/services/types";

const InvoicePaymentCard = ({ invoice }: { invoice: invoicess_type }) => {
  const [parsed, setParsed] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useSalesInvoices();
  const [session,] = useSession();

  const [payAmount, setPayAmount] = useState(0);

  const _setPayAmount = (e: number) => {
    if (parsed && parsed.balance() >= e) {
      setPayAmount(e);
    } else {
      setPayAmount(parsed.balance());
    }
  }

  const addPayment = async () => {
    confirm({
      title: `Are you sure add payment of ${parsed.balance()} ?`, onOk: async () => {
        setLoading(true);
        try {
          if (parsed.balance() == 0 || parsed.amount() < payAmount) {
            message.error("You cannot overpay invoice!");
            setLoading(false);
            return false;
          }
          const resp: invoicess_type = await (await axios.post("/action/payreceipts", {
            invoice_id: invoice.id,
            amount: payAmount,
            user_id: session?.id
          })).data;
          if (resp.id) {
            setParsed({ ...parseInvoice(resp) });
            setInvoices([...invoices, resp]);
            setPayAmount(0);
            message.success("Payment added");
          }
        } catch (error: any) {
          message.error(error.message);
        }
        setLoading(false);
      }
    });
  }

  useEffect(() => {
    if (invoice) {
      setParsed(parseInvoice(invoice));
    }
  }, [invoice]);
  return (
    <>
      {parsed && (
        <Card title={`Payment for Invoice ${invoice.invoice_num}`}>
          <List>
            <List.Item><b>Amount: </b> {parsed.amount()}</List.Item>
            <List.Item><b>Amount Paid: </b> {parsed.paid_amount()}</List.Item>
            <List.Item><b>Balance: </b> {parsed.balance()}</List.Item>
          </List>
          {parsed.balance() > 0 &&
            <Space>
              <InputNumber disabled={loading} max={parsed.balance()} min={0.00} value={payAmount} onChange={(e) => _setPayAmount(e)} />
              <Button disabled={loading} loading={loading} onClick={() => addPayment()}>Payment Amount</Button>
            </Space>
          }
        </Card>
      )}
    </>
  );
}

export default InvoicePaymentCard;