import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/admin/Login";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ProductsAdmin from "./pages/admin/ProductsAdmin";
import OffersAdmin from "./pages/admin/OffersAdmin";
import OrdersAdmin from "./pages/admin/OrdersAdmin";
import InventoryAdmin from "./pages/admin/InventoryAdmin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductsAdmin />} />
          <Route path="offers" element={<OffersAdmin />} />
          <Route path="orders" element={<OrdersAdmin />} />
          <Route path="inventory" element={<InventoryAdmin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
