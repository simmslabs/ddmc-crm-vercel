import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Input, InputNumber, message, Select, Space, Switch, Upload, UploadProps } from "antd";
import { RcFile, UploadFile } from "antd/lib/upload/interface";
import axios from "axios";
import { SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "@remix-run/react";
import slugify from "slugify";
import { useBrands, useCategories, useInventories } from "~/services/hooks";
import { LoaderFunction } from "remix";
import prisma from "~/services/prisma";
import { inventory_type } from "~/services/types";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  if (url.searchParams.has("id")) {
    const id = parseInt(url.searchParams.get("id") as string, 10);
    const inventory = await prisma.inventories.findFirst({ where: { id }, include: { images: true, category: true, brand: true } });
    console.log(inventory);

    if (inventory) {
      return inventory;
    }
  } else {
    return null;
  }
}

const ProductCreatePage = () => {

  const edit_data = useLoaderData<inventory_type>();

  const nav = useNavigate();
  const [loader, setLoader] = useState(false);
  const [update, setUpdate] = useState(0);

  const [brands, setBrands] = useBrands();
  const [categories, setCategories] = useCategories();

  const [fileList, setFileList] = useState<UploadFile[]>([] as UploadFile[]);

  const [title, setTitle] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [salesPrice, setSalesPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [productCode, setProductCode] = useState<string>('');
  const [productBrand, setProductBrand] = useState<number>();
  const [productCategory, setProductCategory] = useState<number>();
  const [showInShop, setShowInShop] = useState<boolean>(true);
  const [products, setProducts] = useInventories();

  const handleChange = (e: UploadProps) => {
    setFileList(e.fileList as UploadFile[]);
  }

  const saveProduct = async () => {
    setLoader(true);
    try {
      let dt = {
        title: title as string,
        slug: slug as string,
        description: description as string,
        purchase_price: purchasePrice?.toString() as string,
        sales_price: salesPrice?.toString() as string,
        quantity: quantity?.toString() as string,
        product_code: productCode?.toString() as string,
        product_brand: productBrand?.toString() as string,
        product_category: productCategory?.toString() as string,
        show_in_shop: showInShop ? '1' : '0',
        update: update.toString()
      }
      const images = fileList.map(f => f.originFileObj);
      const fdt = new FormData();
      if (images.length > 0) {
        images.map(i => fdt.append('images', i as Blob));
      }
      Object.keys(dt).forEach((k) => {
        fdt.append(k, dt[k as keyof typeof dt]);
      });
      const { success, message, data } = await (await axios.post("create-post", fdt)).data;
      if (success && data) {
        setTitle('');
        setSlug('');
        setDescription('');
        setPurchasePrice(0);
        setSalesPrice(0);
        setQuantity(0);
        setProductCode('');
        setProductBrand(0);
        setProductCategory(0);
        setShowInShop(true);
        setFileList([]);
        if (update) {
          setProducts(products.map(p => p.id === data.id ? data : p));
        } else {
          setProducts([data, ...products]);
        }
        nav("/dashboard/pands/products");
      }
    } catch (error: any) {
      message.error(error.message);
    }
    setLoader(false);
  }

  useEffect(() => {
    if (title) {
      setSlug(slugify(title).toLowerCase());
    }
  }, [title]);

  useEffect(() => {
    if (edit_data) {
      setTitle(edit_data.title);
      setSlug(edit_data.slug);
      if (edit_data.description) {
        setDescription(edit_data.description);
      }
      if (edit_data.purchase_price) {
        setPurchasePrice(edit_data.purchase_price / 100);
      }
      if (edit_data.sales_price) {
        setSalesPrice(edit_data.sales_price / 100);
      }
      if (edit_data.quantity) {
        setQuantity(edit_data.quantity);
      }
      if (edit_data.code) {
        setProductCode(edit_data.code);
      }
      if (edit_data.brandsId) {
        setProductBrand(edit_data.brandsId);
      }
      if (edit_data.categoriesId) {
        setProductCategory(edit_data.categoriesId);
      }
      if (edit_data.show_in_shop) {
        setShowInShop(edit_data.show_in_shop);
      }
      setUpdate(edit_data.id);
      if (edit_data.images.length > 0) {
        for (let i = 0; i < edit_data.images.length; i++) {
          const image = edit_data.images[i];
          (async () => {
            const img = await (await fetch(`/images/products/${image.image}`)).blob();
            setFileList([...fileList, {
              uid: image.id as unknown as string,
              name: image.image,
              status: 'done',
              url: URL.createObjectURL(img),
              thumbUrl: URL.createObjectURL(img),
              originFileObj: img as RcFile,
            }]);
          })();
        }
      }
    }
  }, [edit_data]);

  return (
    <Card loading={loader} title="Add or Edit Inventory Item">
      <Space style={{ width: "100%" }}>
        <Space direction="vertical">
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input disabled placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
          <InputNumber placeholder="Quantity" style={{ width: '100%' }} value={quantity} onChange={(e) => setQuantity(e)} />
          <Input.TextArea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Description" />
          <Divider />
          <InputNumber value={purchasePrice} onChange={(e) => setPurchasePrice(e)} style={{ width: '100%' }} placeholder="Purchase Price" />
          <InputNumber value={salesPrice} onChange={(e) => setSalesPrice(e)} style={{ width: '100%' }} placeholder="Selling Price" />
          <Divider />
          <Input value={productCode} onChange={(e) => setProductCode(e.target.value)} placeholder="Product Code" />
          <Select value={productBrand} onChange={(e) => setProductBrand(e)} style={{ width: '100%' }} placeholder="Product Brand">
            <Select.Option value={undefined}> </Select.Option>
            {brands.map(brand => (<Select.Option value={brand.id}>{brand.name}</Select.Option>))}
          </Select>
          <Select value={productCategory} onChange={(e) => setProductCategory(e)} style={{ width: '100%' }} placeholder="Product Category">
            <Select.Option value={undefined}> </Select.Option>
            {categories.map(category => (<Select.Option value={category.id} >{category.title}</Select.Option>))}
          </Select>
          <Divider />
          <label>Show in shop?</label>
          <Switch checked={showInShop} onChange={setShowInShop} />
          <Divider />
          <Button onClick={() => saveProduct()} style={{ width: '100%' }}>{update ? 'Update' : 'Save'}</Button>
        </Space>
        <Divider type="vertical" />
        <Space direction="vertical">
          <Upload listType="picture-card" onChange={(e) => handleChange(e)} fileList={fileList} action="https://www.mocky.io/v2/5cc8019d300000980a055e76" >
            {fileList.length != 6 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Space>
      </Space>
    </Card >
  )
};

export default ProductCreatePage;
