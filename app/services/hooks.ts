import { customers, employees, receipts } from "@prisma/client";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Cookies from "universal-cookie";
import { useLocalStorage } from "use-hooks";
import { accounts_state, brands_state, categories_state, customers_state, departments_state, employees_state, employee_positions_state, inventories_state, media_sizes_state, media_types_state, menu_key_state, payments_and_receipts_state, permissions_state, products_services_state, projects_state, project_categories_state, project_status_state, purchase_invoices_state, roles_state, sales_invoices_state, sales_quote_invoices_state, suppliers_state, tasks_state } from "./states";
import { employees_type, invoicess_type } from "./types";

export const useMenyKeyState = () => {
  const [menuKeyState, setMenuKeyState] = useRecoilState(menu_key_state);
  return [menuKeyState, setMenuKeyState] as const;
}

export const useAccounts = () => {
  const [accounts, setAccounts] = useRecoilState(accounts_state);
  return [accounts, setAccounts] as const;
}

export const useInventories = () => {
  const [inventories, setInventories] = useRecoilState(inventories_state);
  return [inventories, setInventories] as const;
}

export const useCustomers = () => {
  const [customers, setCustomers] = useRecoilState(customers_state);
  return [customers, setCustomers] as const;
}

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useRecoilState(suppliers_state);
  return [suppliers, setSuppliers] as const;
}

export const useMediaTypes = () => {
  const [mediaTypes, setMediaTypes] = useRecoilState(media_types_state);
  return [mediaTypes, setMediaTypes] as const;
}

export const useMediaSizes = () => {
  const [mediaSizes, setMediaSizes] = useRecoilState(media_sizes_state);
  return [mediaSizes, setMediaSizes] as const;
}

export const useCategories = () => {
  const [categories, setCategories] = useRecoilState(categories_state);
  return [categories, setCategories] as const;
}

export const usePurchaseInvoices = () => {
  const [purchaseInvoices, setPurchaseInvoices] = useRecoilState(purchase_invoices_state);
  return [purchaseInvoices, setPurchaseInvoices] as const;
}

export const useSalesInvoices = () => {
  const [salesInvoices, setSalesInvoices] = useRecoilState(sales_invoices_state);
  return [salesInvoices, setSalesInvoices] as const;
}

export const useSalesQuotes = () => {
  const [salesQuotes, setSalesQuotes] = useRecoilState(sales_quote_invoices_state);
  return [salesQuotes, setSalesQuotes] as const;
}

export const usePaymentsAndReceipts = () => {
  const [paymentsAndReceipts, setPaymentsAndReceipts] = useRecoilState(payments_and_receipts_state);
  return [paymentsAndReceipts, setPaymentsAndReceipts] as const;
}

export const useProjects = () => {
  const [projects, setProjects] = useRecoilState(projects_state);
  return [projects, setProjects] as const;
}

export const useTasks = () => {
  const [tasks, setTasks] = useRecoilState(tasks_state);
  return [tasks, setTasks] as const;
}

export const useProjectStatus = () => {
  const [projectStatus, setProjectStatus] = useRecoilState(project_status_state);
  return [projectStatus, setProjectStatus] as const;
}

export const useEmployees = () => {
  const [employees, setEmployees] = useRecoilState(employees_state);
  return [employees, setEmployees] as const;
}

export const useDepartments = () => {
  const [departments, setDepartments] = useRecoilState(departments_state);
  return [departments, setDepartments] as const;
}

export const useEmployeePositions = () => {
  const [employeePositions, setEmployeePositions] = useRecoilState(employee_positions_state);
  return [employeePositions, setEmployeePositions] as const;
}

export const useBrands = () => {
  const [brands, setBrands] = useRecoilState(brands_state);
  return [brands, setBrands] as const;
}

export const useProductServices = () => {
  const [productServices, setProductServices] = useRecoilState(products_services_state);
  return [productServices, setProductServices] as const;
};

export const useSession = () => {
  const [sessions, setSession] = useLocalStorage<employees_type | null>("session", null);
  return [sessions, setSession] as const;
}

export const getServerToken = (request: Request) => {
  const coo = request.headers.get("Cookie");
  const cookie = new Cookies(coo);
  return cookie.get("session");
}

export const useRoles = () => {
  const [roles, setRoles] = useRecoilState(roles_state);
  return [roles, setRoles] as const;
}

export const usePermissions = () => {
  const [permissions, setPermissions] = useRecoilState(permissions_state);
  return [permissions, setPermissions] as const;
}

export const useProjectCategories = () => {
  const [projectCategories, setProjectCategories] = useRecoilState(project_categories_state);
  return [projectCategories, setProjectCategories] as const;
}

export const parseInvoice = (inv: invoicess_type) => {
  const fx = {
    ...inv,
    amount: () => {
      let total = 0;
      if (inv.total_amount) {
        total = inv.total_amount;
      } else {
        const items = inv.invoice_items;
        for (let index = 0; index < items.length; index++) {
          const element = items[index];
          if (element.amount) {
            total += element.amount;
          }
        }
      }
      return total;
    },
    paid_amount: () => {
      const payments = inv.receipts;
      let total = 0;
      if (payments) {
        for (let i = 0; i < payments.length; i++) {
          const receipt = payments[i];
          total += receipt.amount;
        }
      }
      return total / 100;
    },
    balance: () => {
      return fx.amount() - fx.paid_amount();
    },
    is_paid: () => {
      if (fx.amount() == fx.paid_amount()) {
        return true;
      }
    },
    customer_name: () => {
      if (inv.customer) {
        return inv.customer.name;
      }
      if (inv.supplier) {
        return inv.supplier.name;
      }
    },
    payments: () => {
      let payments: receipts[] = [];
      if (inv.receipts) {
        payments = inv.receipts;
      }
      return payments;
    },
    isSales: () => {
      return inv.type === "sale";
    },
    isPurchase: () => {
      return inv.type === "purchase";
    },
    payments_total: () => {
      let total = 0;
      const payments = fx.payments();
      if (payments) {
        for (let i = 0; i < payments.length; i++) {
          const payment = payments[i];
          total += payment.amount;
        }
      }
      return total / 100;
    }
  };
  return fx;
}

export const usePerms = () => {
  const [session,] = useSession();
  const [perms, setPerms] = useState<any>();
  useEffect(() => {
    if (session) {
      const permissions = session.role.role_permissions.map((rp) => rp.permission.name);
      setPerms({
        can: (_prm: string) => permissions.includes(_prm)
      });
    }
  }, [session]);
  return perms;
}