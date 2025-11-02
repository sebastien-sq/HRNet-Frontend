import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import AddEmployees from '../pages/AddEmployees';
import employeesReducer from '../slices/EmployeeSlice';
import { states } from '../utils/variables';
import { persistReducer } from 'redux-persist';
import type { RootState } from '../store/store';
import ListEmployees from '../pages/ListEmployees';

// Mock redux-persist storage
const mockStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

jest.mock('redux-persist/lib/storage', () => ({
  __esModule: true,
  default: mockStorage,
}));

describe('AddEmployees Component', () => {
  let store: ReturnType<typeof configureStore>;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    jest.clearAllMocks();
    // redux-persist v6 s'attend à ce que getItem et setItem retournent des promesses
    mockStorage.getItem.mockResolvedValue(null);
    mockStorage.setItem.mockResolvedValue(undefined);
    user = userEvent.setup();

    const persistConfig = {
      key: 'employees',
      storage: mockStorage as any,
    };
    
    const persistedReducer = persistReducer(persistConfig, employeesReducer);

    store = configureStore({
      reducer: {
        employees: persistedReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
    });
  });

  test('devrait afficher le formulaire', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/add" element={<AddEmployees />} />
            <Route path="/list" element={<ListEmployees />} />
            <Route path="*" element={<Navigate to="/add" />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Department/i)).toBeInTheDocument();
  });

  test('devrait ajouter un employé au store après soumission du formulaire', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/add" element={<AddEmployees />} />
            <Route path="/list" element={<ListEmployees />} />
            <Route path="*" element={<Navigate to="/add" />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    // Remplir le formulaire avec userEvent
    await user.type(screen.getByLabelText(/First Name/i), 'Jean');
    await user.type(screen.getByLabelText(/Last Name/i), 'Dupont');
    await user.type(screen.getByLabelText(/Date of Birth/i), '1990-01-15');
    await user.type(screen.getByLabelText(/Start Date/i), '2024-01-01');
    await user.type(screen.getByLabelText(/Street/i), '123 Main Street');
    await user.type(screen.getByLabelText(/City/i), 'Los Angeles');
    await user.selectOptions(screen.getByLabelText(/State/i), states[5].name); // California
    await user.type(screen.getByLabelText(/Zip Code/i), '90001');
    await user.selectOptions(screen.getByLabelText(/Department/i), 'Sales');

    // Soumettre le formulaire
    await user.click(screen.getByRole('button', { name: /Save/i }));

    // Vérifier le message de succès
    await waitFor(() => {
      expect(screen.getByText(/Employee added successfully/i)).toBeInTheDocument();
    });

    // Vérifier que l'employé est dans le store
    const state = store.getState() as RootState;
    expect((state as RootState).employees.list).toHaveLength(1);
    expect((state as RootState).employees.list[0]).toMatchObject({
      firstName: 'Jean',
      lastName: 'Dupont',
      dateOfBirth: '1990-01-15',
      startDate: '2024-01-01',
      street: '123 Main Street',
      city: 'Los Angeles',
      state: states[5].name, // California
      zipCode: '90001',
      department: 'Sales',
    });
  });

  test('devrait afficher une erreur si l\'employé a moins de 18 ans', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/add" element={<AddEmployees />} />
            <Route path="/list" element={<ListEmployees />} />
            <Route path="*" element={<Navigate to="/add" />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    // Calculer une date qui rend la personne mineure (moins de 18 ans)
    const today = new Date();
    const underageDate = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate());
    const underageDateStr = underageDate.toISOString().split('T')[0];

    // Remplir le formulaire avec une date de naissance invalide
    await user.type(screen.getByLabelText(/First Name/i), 'Mineur');
    await user.type(screen.getByLabelText(/Last Name/i), 'Test');
    await user.type(screen.getByLabelText(/Date of Birth/i), underageDateStr);
    await user.type(screen.getByLabelText(/Start Date/i), '2024-01-01');
    await user.type(screen.getByLabelText(/Street/i), '123 Main Street');
    await user.type(screen.getByLabelText(/City/i), 'Los Angeles');
    await user.selectOptions(screen.getByLabelText(/State/i), states[5].name);
    await user.type(screen.getByLabelText(/Zip Code/i), '90001');
    await user.selectOptions(screen.getByLabelText(/Department/i), 'Sales');

    // Soumettre le formulaire
    await user.click(screen.getByRole('button', { name: /Save/i }));

    // Vérifier que le message d'erreur s'affiche
    await waitFor(() => {
      expect(screen.getByText(/Employee must be at least 18 years old/i)).toBeInTheDocument();
    });

    // Vérifier que l'employé n'est PAS dans le store
    const state = store.getState() as RootState;
    expect((state as RootState).employees.list).toHaveLength(0);
  });

  test('devrait afficher une erreur si la date de début est avant la date de naissance', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/add" element={<AddEmployees />} />
            <Route path="/list" element={<ListEmployees />} />
            <Route path="*" element={<Navigate to="/add" />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    // Remplir le formulaire avec startDate avant dateOfBirth
    await user.type(screen.getByLabelText(/First Name/i), 'Test');
    await user.type(screen.getByLabelText(/Last Name/i), 'User');
    await user.type(screen.getByLabelText(/Date of Birth/i), '1990-05-15');
    await user.type(screen.getByLabelText(/Start Date/i), '1985-01-01'); // Avant la naissance !
    await user.type(screen.getByLabelText(/Street/i), '123 Main Street');
    await user.type(screen.getByLabelText(/City/i), 'Los Angeles');
    await user.selectOptions(screen.getByLabelText(/State/i), states[5].name);
    await user.type(screen.getByLabelText(/Zip Code/i), '90001');
    await user.selectOptions(screen.getByLabelText(/Department/i), 'Sales');

    // Soumettre le formulaire
    await user.click(screen.getByRole('button', { name: /Save/i }));

    // Vérifier que le message d'erreur s'affiche
    await waitFor(() => {
      expect(screen.getByText(/Start date must be after date of birth/i)).toBeInTheDocument();
    });

    // Vérifier que l'employé n'est PAS dans le store
    const state = store.getState() as RootState;
    expect((state as RootState).employees.list).toHaveLength(0);
  });

});

