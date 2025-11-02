import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import ListEmployees from './pages/ListEmployees'
import AddEmployees from './pages/AddEmployees'

export default function App() {
      return (
        <BrowserRouter>
        <Routes>
          <Route path="/add" element={<AddEmployees />} />
          <Route path="/list" element={<ListEmployees />} />
          <Route path="*" element={<Navigate to="/add" />} />
        </Routes>
      </BrowserRouter>
      );
}
