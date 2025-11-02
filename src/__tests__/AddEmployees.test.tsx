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

// Helper function pour interagir avec les composants Select Radix UI
const selectOption = async (user: ReturnType<typeof userEvent.setup>, labelText: string | RegExp, optionText: string) => {
  // Trouver le label - utiliser getAllByText pour éviter les erreurs de multiples éléments
  let label: HTMLElement;
  
  if (labelText instanceof RegExp) {
    // Chercher tous les éléments qui correspondent au regex
    const allLabels = screen.getAllByText(labelText);
    // Prendre le premier qui est un <label>
    label = allLabels.find(el => el.tagName.toLowerCase() === 'label') || allLabels[0];
  } else {
    try {
      const allLabels = screen.getAllByText(labelText);
      label = allLabels.find(el => el.tagName.toLowerCase() === 'label') || allLabels[0];
    } catch {
      label = screen.getByText(labelText);
    }
  }
  
  // Trouver le SelectTrigger associé au label
  // Le Select est généralement dans le même conteneur parent que le label
  const labelContainer = label.closest('div');
  let trigger: HTMLElement | null = null;
  
  if (labelContainer) {
    // Chercher le trigger (combobox) dans le même conteneur ou dans les enfants
    trigger = labelContainer.querySelector('[role="combobox"]') as HTMLElement;
    
    // Si pas trouvé dans le conteneur direct, chercher dans le parent
    if (!trigger && labelContainer.parentElement) {
      trigger = labelContainer.parentElement.querySelector('[role="combobox"]') as HTMLElement;
    }
    
    // Si toujours pas trouvé, chercher dans les siblings suivants
    if (!trigger && labelContainer.nextElementSibling) {
      trigger = labelContainer.nextElementSibling.querySelector('[role="combobox"]') as HTMLElement;
    }
  }
  
  // Si toujours pas trouvé, chercher tous les combobox et trouver celui qui correspond
  if (!trigger) {
    const allTriggers = screen.getAllByRole('combobox');
    // Pour State et Department, utiliser l'index basé sur l'ordre dans le formulaire
    // State est le premier Select, Department est le deuxième
    if (labelText.toString().includes('State') || (labelText instanceof RegExp && labelText.test('State'))) {
      trigger = allTriggers[0] || null;
    } else if (labelText.toString().includes('Department') || (labelText instanceof RegExp && labelText.test('Department'))) {
      trigger = allTriggers[allTriggers.length > 1 ? 1 : 0] || null;
    } else {
      trigger = allTriggers[0] || null;
    }
  }
  
  if (!trigger) {
    throw new Error(`Could not find SelectTrigger for label: ${labelText}`);
  }
  
  // Cliquer sur le trigger pour ouvrir le menu
  await user.click(trigger);
  
  // Attendre que le menu s'ouvre et trouver l'option par son texte
  await waitFor(() => {
    const options = screen.getAllByText(optionText);
    expect(options.length).toBeGreaterThan(0);
  }, { timeout: 3000 });
  
  // Cliquer sur l'option dans le menu SelectContent (pas dans le SelectValue)
  const options = screen.getAllByText(optionText);
  // Trouver l'option qui est dans le SelectContent (data-slot="select-item")
  const selectItem = options.find(option => 
    option.closest('[data-slot="select-item"]') !== null
  ) || options[options.length - 1]; // Prendre la dernière occurrence si pas trouvé
  
  await user.click(selectItem);
  
  // Attendre un peu pour que la sélection soit appliquée et que le menu se ferme
  await new Promise(resolve => setTimeout(resolve, 100));
};

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

    // Vérifier la présence des champs input natifs
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date of Birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Start Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Street/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Zip Code/i)).toBeInTheDocument();
    
    // Vérifier la présence des labels pour les Select Radix UI
    const stateLabels = screen.getAllByText(/^State$/i);
    const stateLabelElement = stateLabels.find(el => el.tagName.toLowerCase() === 'label');
    expect(stateLabelElement).toBeInTheDocument();
    
    const departmentLabels = screen.getAllByText(/^Department$/i);
    const departmentLabelElement = departmentLabels.find(el => el.tagName.toLowerCase() === 'label');
    expect(departmentLabelElement).toBeInTheDocument();
    
    // Vérifier la présence du bouton Save
    expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
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
    await selectOption(user, /State/i, states[5].name); // California
    await user.type(screen.getByLabelText(/Zip Code/i), '90001');
    await selectOption(user, /Department/i, 'Sales');

    // Soumettre le formulaire
    await user.click(screen.getByRole('button', { name: /Save/i }));

    // Vérifier que le modal de succès s'affiche
    await waitFor(() => {
      expect(screen.getByText(/Employee added successfully!/i)).toBeInTheDocument();
      expect(screen.getByText(/You can see the employee in the list page!/i)).toBeInTheDocument();
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

  test('devrait fermer le modal lorsqu\'on clique sur le bouton de fermeture', async () => {
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
    await user.type(screen.getByLabelText(/First Name/i), 'Test');
    await user.type(screen.getByLabelText(/Last Name/i), 'User');
    await user.type(screen.getByLabelText(/Date of Birth/i), '1990-01-15');
    await user.type(screen.getByLabelText(/Start Date/i), '2024-01-01');
    await user.type(screen.getByLabelText(/Street/i), '123 Main Street');
    await user.type(screen.getByLabelText(/City/i), 'Los Angeles');
    await selectOption(user, /State/i, states[5].name);
    await user.type(screen.getByLabelText(/Zip Code/i), '90001');
    await selectOption(user, /Department/i, 'Sales');

    // Soumettre le formulaire
    await user.click(screen.getByRole('button', { name: /Save/i }));

    // Attendre que le modal s'affiche
    await waitFor(() => {
      expect(screen.getByText(/Employee added successfully!/i)).toBeInTheDocument();
    });

    // Vérifier que le modal est visible
    const modal = screen.getByText(/Employee added successfully!/i).closest('div');
    expect(modal).toBeInTheDocument();

    // Cliquer sur le bouton de fermeture (X)
    const closeButton = screen.getByRole('button', { name: /X/i });
    await user.click(closeButton);

    // Vérifier que le modal n'est plus visible
    await waitFor(() => {
      expect(screen.queryByText(/Employee added successfully!/i)).not.toBeInTheDocument();
    });
  });

  test('devrait fermer le modal lorsqu\'on clique en dehors du modal', async () => {
    const { container } = render(
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
    await user.type(screen.getByLabelText(/First Name/i), 'Test');
    await user.type(screen.getByLabelText(/Last Name/i), 'User');
    await user.type(screen.getByLabelText(/Date of Birth/i), '1990-01-15');
    await user.type(screen.getByLabelText(/Start Date/i), '2024-01-01');
    await user.type(screen.getByLabelText(/Street/i), '123 Main Street');
    await user.type(screen.getByLabelText(/City/i), 'Los Angeles');
    await selectOption(user, /State/i, states[5].name);
    await user.type(screen.getByLabelText(/Zip Code/i), '90001');
    await selectOption(user, /Department/i, 'Sales');

    // Soumettre le formulaire
    await user.click(screen.getByRole('button', { name: /Save/i }));

    // Attendre que le modal s'affiche
    await waitFor(() => {
      expect(screen.getByText(/Employee added successfully!/i)).toBeInTheDocument();
    });

    // Trouver le backdrop (la div avec la classe fixed)
    const backdrop = container.querySelector('.fixed.inset-0');
    expect(backdrop).toBeInTheDocument();

    // Cliquer sur le backdrop (fond noir) du modal
    if (backdrop) {
      await user.click(backdrop as HTMLElement);
    }

    // Vérifier que le modal n'est plus visible
    await waitFor(() => {
      expect(screen.queryByText(/Employee added successfully!/i)).not.toBeInTheDocument();
    });
  });

  test('devrait afficher une erreur si l\'employé existe déjà', async () => {
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

    // Ajouter un premier employé
    await user.type(screen.getByLabelText(/First Name/i), 'Jean');
    await user.type(screen.getByLabelText(/Last Name/i), 'Dupont');
    await user.type(screen.getByLabelText(/Date of Birth/i), '1990-01-15');
    await user.type(screen.getByLabelText(/Start Date/i), '2024-01-01');
    await user.type(screen.getByLabelText(/Street/i), '123 Main Street');
    await user.type(screen.getByLabelText(/City/i), 'Los Angeles');
    await selectOption(user, /State/i, states[5].name);
    await user.type(screen.getByLabelText(/Zip Code/i), '90001');
    await selectOption(user, /Department/i, 'Sales');

    // Soumettre le premier formulaire
    await user.click(screen.getByRole('button', { name: /Save/i }));

    // Attendre que le modal s'affiche
    await waitFor(() => {
      expect(screen.getByText(/Employee added successfully!/i)).toBeInTheDocument();
    }, { timeout: 5000 });

    // Fermer le modal
    const closeButton = screen.getByRole('button', { name: /X/i });
    await user.click(closeButton);

    // Attendre que le modal se ferme
    await waitFor(() => {
      expect(screen.queryByText(/Employee added successfully!/i)).not.toBeInTheDocument();
    });

    // Vérifier que l'employé est dans le store
    const state = store.getState() as RootState;
    expect((state as RootState).employees.list).toHaveLength(1);

    // Essayer d'ajouter le même employé une deuxième fois
    // Remplir le formulaire avec les mêmes données
    const firstNameInput = screen.getByLabelText(/First Name/i) as HTMLInputElement;
    const lastNameInput = screen.getByLabelText(/Last Name/i) as HTMLInputElement;
    const dateOfBirthInput = screen.getByLabelText(/Date of Birth/i) as HTMLInputElement;
    const startDateInput = screen.getByLabelText(/Start Date/i) as HTMLInputElement;
    const streetInput = screen.getByLabelText(/Street/i) as HTMLInputElement;
    const cityInput = screen.getByLabelText(/City/i) as HTMLInputElement;
    const zipCodeInput = screen.getByLabelText(/Zip Code/i) as HTMLInputElement;

    // Vider les champs s'ils sont déjà remplis
    await user.clear(firstNameInput);
    await user.clear(lastNameInput);
    await user.clear(dateOfBirthInput);
    await user.clear(startDateInput);
    await user.clear(streetInput);
    await user.clear(cityInput);
    await user.clear(zipCodeInput);

    // Remplir avec les mêmes données
    await user.type(firstNameInput, 'Jean');
    await user.type(lastNameInput, 'Dupont');
    await user.type(dateOfBirthInput, '1990-01-15');
    await user.type(startDateInput, '2024-01-01');
    await user.type(streetInput, '123 Main Street');
    await user.type(cityInput, 'Los Angeles');
    await selectOption(user, /State/i, states[5].name);
    await user.type(zipCodeInput, '90001');
    await selectOption(user, /Department/i, 'Sales');

    // Soumettre le formulaire
    await user.click(screen.getByRole('button', { name: /Save/i }));

    // Vérifier que le message d'erreur s'affiche
    await waitFor(() => {
      expect(screen.getByText(/Employee already exists/i)).toBeInTheDocument();
    }, { timeout: 5000 });

    // Vérifier que le modal de succès n'est PAS affiché
    expect(screen.queryByText(/Employee added successfully!/i)).not.toBeInTheDocument();

    // Vérifier que l'employé n'a pas été ajouté une deuxième fois dans le store
    const finalState = store.getState() as RootState;
    expect((finalState as RootState).employees.list).toHaveLength(1);
  }, 15000); // Timeout de 15 secondes pour ce test

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
    await selectOption(user, /State/i, states[5].name);
    await user.type(screen.getByLabelText(/Zip Code/i), '90001');
    await selectOption(user, /Department/i, 'Sales');

    // Soumettre le formulaire
    await user.click(screen.getByRole('button', { name: /Save/i }));

    // Vérifier que le message d'erreur s'affiche
    await waitFor(() => {
      expect(screen.getByText(/Start date must be after date of birth/i)).toBeInTheDocument();
    });

    // Vérifier que le modal de succès n'est PAS affiché
    expect(screen.queryByText(/Employee added successfully!/i)).not.toBeInTheDocument();

    // Vérifier que l'employé n'est PAS dans le store
    const state = store.getState() as RootState;
    expect((state as RootState).employees.list).toHaveLength(0);
  });

});

