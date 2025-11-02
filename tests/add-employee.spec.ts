import { test, expect } from '@playwright/test';
import { states } from '../src/utils/variables';

test.describe('Ajout d\'un employé', () => {
  test.beforeEach(async ({ page }) => {
    // Nettoyer le localStorage avant chaque test
    await page.goto('/add');
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  test('devrait enregistrer un utilisateur et vérifier qu\'il est dans le store Redux persist', async ({ page }) => {
    // Données de test
    const employeeData = {
      firstName: 'Jean',
      lastName: 'Dupont',
      dateOfBirth: '1990-01-15',
      startDate: '2024-01-01',
      street: '123 Main Street',
      city: 'Los Angeles',
      state: states[5].name, // California
      zipCode: '90001',
      department: 'Sales',
    };

    // Remplir le formulaire
    await page.fill('#firstName', employeeData.firstName);
    await page.fill('#lastName', employeeData.lastName);
    await page.fill('#dateOfBirth', employeeData.dateOfBirth);
    await page.fill('#startDate', employeeData.startDate);
    await page.fill('#street', employeeData.street);
    await page.fill('#city', employeeData.city);
    await page.selectOption('#state', employeeData.state);
    await page.fill('#zipCode', employeeData.zipCode);
    await page.selectOption('#department', employeeData.department);

    // Soumettre le formulaire en utilisant requestSubmit() pour déclencher l'événement submit
    await page.locator('form').evaluate((form: HTMLFormElement) => {
      form.requestSubmit();
    });

    // Attendre que le message de succès apparaisse
    await expect(page.locator('text=Employee added successfully')).toBeVisible({ timeout: 10000 });

    // Vérifier que les données sont dans le localStorage (Redux persist)
    const persistedData = await page.evaluate(() => {
      return localStorage.getItem('persist:employees');
    });

    expect(persistedData).not.toBeNull();

    // Parser les données persistées
    const parsedData = JSON.parse(persistedData!);
    const employeesState = JSON.parse(parsedData.list || '[]');

    // Vérifier que l'employé a été ajouté
    expect(employeesState).toHaveLength(1);
    expect(employeesState[0]).toMatchObject({
      firstName: employeeData.firstName,
      lastName: employeeData.lastName,
      dateOfBirth: employeeData.dateOfBirth,
      startDate: employeeData.startDate,
      street: employeeData.street,
      city: employeeData.city,
      state: employeeData.state,
      zipCode: employeeData.zipCode,
      department: employeeData.department,
    });

    // Vérifier le state Redux dans le store
    const reduxState = await page.evaluate(() => {
      // Accéder au store Redux via window
      return (window as any).__REDUX_STORE__?.getState();
    });

    if (reduxState) {
      expect(reduxState.employees.list).toHaveLength(1);
      expect(reduxState.employees.list[0]).toMatchObject(employeeData);
    }
  });

  test('devrait ajouter plusieurs employés sans écraser les précédents', async ({ page }) => {
    const employees = [
      {
        firstName: 'Jean',
        lastName: 'Dupont',
        dateOfBirth: '1990-01-15',
        startDate: '2024-01-01',
        street: '123 Main Street',
        city: 'Los Angeles',
        state: states[5].name, // California
        zipCode: '90001',
        department: 'Sales',
      },
      {
        firstName: 'Marie',
        lastName: 'Martin',
        dateOfBirth: '1985-05-20',
        startDate: '2024-02-01',
        street: '456 Broadway',
        city: 'New York',
        state: states[58].name, // New York
        zipCode: '10001',
        department: 'Marketing',
      },
    ];

    // Ajouter le premier employé
    await page.fill('#firstName', employees[0].firstName);
    await page.fill('#lastName', employees[0].lastName);
    await page.fill('#dateOfBirth', employees[0].dateOfBirth);
    await page.fill('#startDate', employees[0].startDate);
    await page.fill('#street', employees[0].street);
    await page.fill('#city', employees[0].city);
    await page.selectOption('#state', employees[0].state);
    await page.fill('#zipCode', employees[0].zipCode);
    await page.selectOption('#department', employees[0].department);
    await page.locator('form').evaluate((form: HTMLFormElement) => {
      form.requestSubmit();
    });
    await expect(page.locator('text=Employee added successfully')).toBeVisible({ timeout: 10000 });

    // Attendre un peu pour que le state soit persisté et que le formulaire soit prêt
    await page.waitForTimeout(1000);
    
    // Vider le formulaire pour le deuxième employé
    await page.fill('#firstName', '');
    await page.fill('#lastName', '');

    // Ajouter le deuxième employé
    await page.fill('#firstName', employees[1].firstName);
    await page.fill('#lastName', employees[1].lastName);
    await page.fill('#dateOfBirth', employees[1].dateOfBirth);
    await page.fill('#startDate', employees[1].startDate);
    await page.fill('#street', employees[1].street);
    await page.fill('#city', employees[1].city);
    await page.selectOption('#state', employees[1].state);
    await page.fill('#zipCode', employees[1].zipCode);
    await page.selectOption('#department', employees[1].department);
    await page.locator('form').evaluate((form: HTMLFormElement) => {
      form.requestSubmit();
    });
    await expect(page.locator('text=Employee added successfully')).toBeVisible({ timeout: 10000 });

    // Vérifier que les deux employés sont dans le localStorage
    const persistedData = await page.evaluate(() => {
      return localStorage.getItem('persist:employees');
    });

    expect(persistedData).not.toBeNull();
    const parsedData = JSON.parse(persistedData!);
    const savedEmployees = JSON.parse(parsedData.list || '[]');

    expect(savedEmployees).toHaveLength(2);
    expect(savedEmployees[0]).toMatchObject(employees[0]);
    expect(savedEmployees[1]).toMatchObject(employees[1]);
  });

  test('devrait conserver les données après rechargement de la page', async ({ page }) => {
    const employeeData = {
      firstName: 'Jean',
      lastName: 'Dupont',
      dateOfBirth: '1990-01-15',
      startDate: '2024-01-01',
      street: '123 Main Street',
      city: 'Los Angeles',
      state: states[5].name, // California
      zipCode: '90001',
      department: 'Sales',
    };

    // Ajouter un employé
    await page.fill('#firstName', employeeData.firstName);
    await page.fill('#lastName', employeeData.lastName);
    await page.fill('#dateOfBirth', employeeData.dateOfBirth);
    await page.fill('#startDate', employeeData.startDate);
    await page.fill('#street', employeeData.street);
    await page.fill('#city', employeeData.city);
    await page.selectOption('#state', employeeData.state);
    await page.fill('#zipCode', employeeData.zipCode);
    await page.selectOption('#department', employeeData.department);
    await page.locator('form').evaluate((form: HTMLFormElement) => {
      form.requestSubmit();
    });
    await expect(page.locator('text=Employee added successfully')).toBeVisible({ timeout: 10000 });

    // Recharger la page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Vérifier que les données sont toujours dans le localStorage
    const persistedData = await page.evaluate(() => {
      return localStorage.getItem('persist:employees');
    });

    expect(persistedData).not.toBeNull();
    const parsedData = JSON.parse(persistedData!);
    const savedEmployees = JSON.parse(parsedData.list || '[]');

    expect(savedEmployees).toHaveLength(1);
    expect(savedEmployees[0]).toMatchObject(employeeData);
  });
});

