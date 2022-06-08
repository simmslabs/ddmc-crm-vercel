import { brands, categories, customers, departments, employees, employee_positions, images, inventories, invoices, invoice_items, permissions, projects, project_categories, project_tasks, receipts, roles, role_has_permissions, suppliers, users } from "@prisma/client";

export type employees_type = employees & { department: departments, position: employee_positions, role: roles_type };
export type invoicess_type = invoices & { user: users, customer: customers, supplier: suppliers, invoice_items: invoice_items[], receipts: receipts[] };
export type inventory_type = inventories & { images: images[], category: categories | null, brand: brands | null };
export type receipts_type = receipts & { customer: customers, supplier: suppliers, invoice_items: invoice_items };
export type projects_type = projects & { customer: customers, category: project_categories, invoice: invoices, tasks: project_tasks[] };
export type roles_type = roles & { role_permissions: role_has_permissions_type[] };
export type role_has_permissions_type = role_has_permissions & { permission: permissions };