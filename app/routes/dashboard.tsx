import { CarOutlined, DropboxOutlined, UsergroupAddOutlined, UserSwitchOutlined } from "@ant-design/icons";
import { invoices_type } from "@prisma/client";
import { LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { Card, Col, Grid, Row, Space } from "antd";
import { useEffect } from "react";
import DashboardLayout from "~/components/DashboardLayout";
import { useAccounts, useBrands, useCategories, useCustomers, useDepartments, useEmployeePositions, useEmployees, useInventories, useMediaSizes, useMediaTypes, usePaymentsAndReceipts, usePermissions, useProductServices, useProjectCategories, useProjects, usePurchaseInvoices, useRoles, useSalesInvoices, useSalesQuotes, useSuppliers } from "~/services/hooks";
import prisma from "~/services/prisma";
import { invoicess_type } from "~/services/types";

export const loader: LoaderFunction = async () => {
  // const receipts = await prisma.receipts.findMany({
  //   orderBy: { id: "desc", }, include: {
  //     // invoice: true
  //   }
  // });
  const customers = await prisma.customers.findMany({ orderBy: { id: "desc" } });
  const projects = await prisma.projects.findMany({
    orderBy: { id: "desc" }, include: {
      customer: true,
      invoice: true,
      category: true,
      tasks: true,
    }
  });
  const suppliers = await prisma.suppliers.findMany({ orderBy: { id: "desc" } });
  const employees = await prisma.employees.findMany({
    orderBy: { id: "desc", }, include: {
      department: true,
      position: true,
      role: true
    }
  });
  const departments = await prisma.departments.findMany({ orderBy: { id: "desc" } });
  const positions = await prisma.employee_positions.findMany({ orderBy: { id: "desc" } });
  const invoices = await prisma.invoices.findMany({
    orderBy: { id: "desc" }, include: {
      user: true,
      supplier: true,
      customer: true,
      receipts: true,
      invoice_items: true,
    }
  });
  const roles = await prisma.roles.findMany({ orderBy: { id: "desc" } });
  const permissions = await prisma.permissions.findMany({ orderBy: { id: "desc" } });
  const inventories = await prisma.inventories.findMany({ orderBy: { id: "desc" }, include: { brand: true, category: true, images: true } });
  const media_sizes = await prisma.media_sizes.findMany({ orderBy: { id: "desc" } });
  const media_types = await prisma.media_types.findMany({ orderBy: { id: "desc" } });
  const brands = await prisma.brands.findMany({ orderBy: { id: "desc" } });
  const products_services = await prisma.products_services.findMany({ orderBy: { id: "desc" } });
  const project_categories = await prisma.project_categories.findMany({ orderBy: { id: "desc" } });
  const categories = await prisma.categories.findMany({ orderBy: { id: "desc" } });
  const accounts = await prisma.accounts.findMany({ orderBy: { id: "desc" } });
  return {
    customers,
    suppliers,
    employees,
    departments,
    positions,
    invoices,
    inventories,
    media_sizes,
    media_types,
    brands,
    products_services,
    categories,
    roles,
    permissions,
    accounts,
    project_categories,
    projects
  };
}

export default function Index() {
  const { roles, customers, suppliers, media_types, employees, departments, positions, invoices, inventories, media_sizes, brands, products_services, categories, permissions, accounts, project_categories, projects } = useLoaderData();
  const [, setCustomers] = useCustomers();
  const [, setSuppliers] = useSuppliers();
  const [, setMediaTypes] = useMediaTypes();
  const [, setEmployees] = useEmployees();
  const [, setDepartments] = useDepartments();
  const [, setPositions] = useEmployeePositions();
  const [, setSalesInvoice] = useSalesInvoices();
  const [, setSalesQuote] = useSalesQuotes();
  const [, setPurchaseInvoices] = usePurchaseInvoices();
  const [, setInventories] = useInventories();
  const [, setMediaSizes] = useMediaSizes();
  const [, setBrands] = useBrands();
  const [, setProductsServices] = useProductServices();
  const [, setCategories] = useCategories();
  const [, setReceipts] = usePaymentsAndReceipts();
  const [, setRoles] = useRoles();
  const [, setPermissions] = usePermissions();
  const [, setAccounts] = useAccounts();
  const [, setProjectCategories] = useProjectCategories();
  const [, setProjects] = useProjects();
  const loc = useLocation();

  useEffect(() => {
    if (customers) {
      setCustomers(customers);
    }
    if (suppliers) {
      setSuppliers(suppliers);
    }
    if (media_types) {
      setMediaTypes(media_types);
    }
    if (employees) {
      setEmployees(employees);
    }
    if (departments) {
      setDepartments(departments);
    }
    if (positions) {
      setPositions(positions);
    }
    if (invoices) {
      setSalesInvoice(invoices.filter((i: invoicess_type) => i.type === 'sale'));
      setSalesQuote(invoices.filter((i: invoicess_type) => i.type === 'quote'));
      setPurchaseInvoices(invoices.filter((i: invoicess_type) => i.type === 'purchase'));
      setReceipts(invoices.filter((i: invoicess_type) => i.type !== 'quote' && i.receipts.length > 0));
    }
    if (inventories) {
      setInventories(inventories);
    }
    if (media_sizes) {
      setMediaSizes(media_sizes);
    }
    if (brands) {
      setBrands(brands);
    }
    if (products_services) {
      setProductsServices(products_services);
    }
    if (categories) {
      setCategories(categories);
    }
    if (roles) {
      setRoles(roles);
    }
    if (permissions) {
      setPermissions(permissions);
    }
    if (accounts) {
      setAccounts(accounts);
    }
    if (project_categories) {
      setProjectCategories(project_categories);
    }
    if (projects) {
      setProjects(projects);
    }
  }, []);
  return (
    <DashboardLayout>
      <div style={{ padding: 10 }}>
        {(loc.pathname == "/dashboard/" || loc.pathname == "/dashboard") ?
          <Row gutter={10}>
            <Col md={14}>
              <Row gutter={10}>
                <Col md={6}>
                  <Card>
                    <Space direction="vertical" size="middle">
                      <UsergroupAddOutlined style={{ fontSize: 60 }} />
                      <h1 style={{ fontSize: 40, color: 'red' }}>{customers.length}</h1>
                      <h1 style={{ color: '#ccc' }}>No. of Customers</h1>
                    </Space>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card>
                    <Space direction="vertical" size="middle">
                      <CarOutlined style={{ fontSize: 60 }} />
                      <h1 style={{ fontSize: 40, color: 'red' }}>{suppliers.length}</h1>
                      <h1 style={{ color: '#ccc' }}>No. of Suppliers</h1>
                    </Space>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card>
                    <Space direction="vertical" size="middle">
                      <UserSwitchOutlined style={{ fontSize: 60 }} />
                      <h1 style={{ fontSize: 40, color: 'red' }}>{employees.length}</h1>
                      <h1 style={{ color: '#ccc' }}>No. of Employees</h1>
                    </Space>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card>
                    <Space direction="vertical" size="middle">
                      <DropboxOutlined style={{ fontSize: 60 }} />
                      <h1 style={{ fontSize: 40, color: 'red' }}>{inventories.length}</h1>
                      <h1 style={{ color: '#ccc' }}>No. of Inventories</h1>
                    </Space>
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col md={10}>
              <Card title="Recent Activity"></Card>
            </Col>
          </Row>
          : <Outlet />
        }
      </div>
    </DashboardLayout>
  );
}
