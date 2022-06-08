import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, message, Space, Table } from "antd";
import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useInventories } from "~/services/hooks";
import { inventory_type } from "~/services/types";
import confirm from "antd/lib/modal/confirm";
import axios from "axios";

const ProductsPage = () => {

  const [products, setProducts] = useInventories();
  const [del_loading, setDel_loading] = useState(false);

  const deleteItem = async (_data: inventory_type) => {
    confirm({
      title: `Are you sure delete ${_data.title} ?`, onOk: async () => {
        setDel_loading(true);
        try {
          const resp: inventory_type = await (await axios.post("/dashboard/pands/products/delete-post", { id: _data.id })).data;
          if (resp.id) {
            {
              setProducts(products.filter(p => p.id !== resp.id));
            }
          }
        } catch (error: any) {
          message.error(error.message);
        }
        setDel_loading(false);
      }
    });
  }

  return (
    <Table title={() => (
      <Space>
        <Link to="create">
          <Button loading={del_loading} size="small" icon={<PlusOutlined />} shape="circle" />
        </Link>
      </Space>
    )}
      columns={[
        {
          title: "Code",
          dataIndex: "code",
        },
        {
          title: "Name",
          dataIndex: "title",
        },
        {
          title: "Brand",
          dataIndex: "brand",
          render: (text, data) => data.brand && data.brand.name
        },
        {
          title: "Category",
          dataIndex: "category",
          render: (text, data) => data.category && data.category.title
        },
        {
          title: "Quantity",
          dataIndex: "quantity",
        },
        {
          title: "Purchase Price",
          dataIndex: "purchase_price",
          render: (text, data) => data.purchase_price && data.purchase_price / 100
        },
        {
          title: "Sale Price",
          dataIndex: "sales_price",
          render: (text, data) => data.sales_price && data.sales_price / 100
        },
        {
          title: 'Action',
          key: 'action',
          render: (text, data) => (
            <Space>
              <Link to={`create?id=${data.id}`}>
                <Button size="small" icon={<EditOutlined />} shape="circle" />
              </Link>
              <Button onClick={() => deleteItem(data)} size="small" icon={<DeleteOutlined />} shape="circle" />
            </Space>
          )
        }
      ]}
      dataSource={products}>

    </Table>
  );
}

export default ProductsPage;