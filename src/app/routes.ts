import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Authors } from "./pages/Authors";
import { Catalog } from "./pages/Catalog";
import { Contact } from "./pages/Contact";
import { Checkout } from "./pages/Checkout";
import { PaymentConfirmation } from "./pages/PaymentConfirmation";
import { TransactionSuccess } from "./pages/TransactionSuccess";
import { TransactionFailure } from "./pages/TransactionFailure";
import { BankAccountSetup } from "./pages/BankAccountSetup";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "authors", Component: Authors },
      { path: "catalog", Component: Catalog },
      { path: "contact", Component: Contact },
      { path: "checkout", Component: Checkout },
      { path: "payment/confirmation", Component: PaymentConfirmation },
      { path: "payment/success", Component: TransactionSuccess },
      { path: "payment/failure", Component: TransactionFailure },
      { path: "payment/bank-setup", Component: BankAccountSetup },
    ],
  },
]);
