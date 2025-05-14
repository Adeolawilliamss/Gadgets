/*eslint-disable*/
import { Routes, Route } from 'react-router-dom';
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
import Signup from './page/signup/signup';
import Account from './page/Account/account';
import FinalOrder from './page/FinalOrder/FinalOrder';
import { AlertProvider } from './page/context/AlertContext';
import Alert from './page/Alert/Alert';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App({ item }) {
  return (
    <AlertProvider>
      <Alert />
      <Layout>
        <Routes>
           <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/shop/:category" element={<Shop />} />
          <Route path="/products/:id" element={<ItemDetails item={item} />} />
          <Route path="/cart" element={<Cartpage />} />
          <Route path="/checkout" element={<Checkout />}/>
          <Route path="/favourite" element={<Favourite />} />
          <Route path="/signup" element={<Signup />}/>
          <Route path="/account" element={<Account />}/>
          <Route path="/search/:query" element={<Search />} />
          <Route path="/finalorder" element={<FinalOrder />} />
          <Route path="*" element={<h1>404: Page Not Found</h1>} />
        </Routes>
      </Layout>
      <ToastContainer />
    </AlertProvider>
  );
}

export default App;
