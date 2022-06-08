import { accounts, brands, categories, customers, departments, employees, employee_positions, invoices, media_sizes, media_types, permissions, products_services, projects, project_categories, receipts, roles, suppliers } from "@prisma/client";
import { atom } from "recoil";
import { employees_type, inventory_type, invoicess_type, projects_type, receipts_type } from "./types";

export const menu_key_state = atom({
  key: "menu_key_state",
  default: "",
});

export const accounts_state = atom({
  key: "accounts_state",
  default: [] as accounts[],
});

export const inventories_state = atom({
  key: "inventories_state",
  default: [] as inventory_type[],
});

export const customers_state = atom({
  key: "customers_state",
  default: [] as customers[],
});

export const suppliers_state = atom({
  key: "suppliers_state",
  default: [] as suppliers[],
});

export const media_types_state = atom({
  key: "media_types_state",
  default: [] as media_types[],
});

export const media_sizes_state = atom({
  key: "media_sizes_state",
  default: [] as media_sizes[],
});

export const categories_state = atom({
  key: "categories_state",
  default: [] as categories[],
})

export const purchase_invoices_state = atom({
  key: "purchase_invoices_state",
  default: [] as invoicess_type[],
});

export const sales_invoices_state = atom({
  key: "sales_invoices_state",
  default: [] as invoicess_type[],
});

export const sales_quote_invoices_state = atom({
  key: "sales_quote_invoices_state",
  default: [] as invoicess_type[],
});

export const payments_and_receipts_state = atom({
  key: "payments_and_receipts_state",
  default: [] as invoicess_type[],
})

export const projects_state = atom({
  key: "projects_state",
  default: [] as projects_type[],
});

export const tasks_state = atom({
  key: "tasks_state",
  default: [],
});

export const project_status_state = atom({
  key: "project_status_state",
  default: [],
});

export const employees_state = atom({
  key: "employees_state",
  default: [] as employees_type[],
});

export const departments_state = atom({
  key: "departments_state",
  default: [] as departments[],
});

export const employee_positions_state = atom({
  key: "employee_positions_state",
  default: [] as employee_positions[],
});

export const brands_state = atom({
  key: "brands_state",
  default: [] as brands[],
});

export const products_services_state = atom({
  key: "products_services_state",
  default: [] as products_services[]
});

export const roles_state = atom({
  key: "roles_state",
  default: [] as roles[],
});

export const permissions_state = atom({
  key: "permissions_state",
  default: [] as permissions[],
});

export const project_categories_state = atom({
  key: "project_categories_state",
  default: [] as project_categories[],
})