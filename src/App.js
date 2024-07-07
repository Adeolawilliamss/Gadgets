import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Home from './page/Home';
import Shop from './Components/Shop/Shop';
import ItemDetails from './page/ItemDetails/ItemDetails';
import Login from './page/login/Login';
import Layout from './Components/Layout';
import Cartpage from './page/Cartpage/Cartpage';
import Checkout from './page/Checkout/Checkout';
import Search from './Components/Search/Search';
import Favourite from './page/Favourites/Favourite';
import FinalOrder from './page/FinalOrder/FinalOrder';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App({ item }) {
  let location = useLocation();

  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop/:category" element={<Shop />} />
          <Route path="/products/:id" element={<ItemDetails item={item} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cartpage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/favourite" element={<Favourite />} />
          <Route path="/search/:query" element={<Search />} />
          <Route path="/finalorder" element={<FinalOrder />} />
          <Route path="*" element={<h1>404: Page Not Found</h1>} />
        </Routes>
      </Layout>
      <ToastContainer />
    </>
  );
}

export default App;