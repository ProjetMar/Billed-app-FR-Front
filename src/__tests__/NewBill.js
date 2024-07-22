// /**
//  * @jest-environment jsdom
//  */

// import { screen } from "@testing-library/dom"
// import NewBillUI from "../views/NewBillUI.js"
// import NewBill from "../containers/NewBill.js"
// import '@testing-library/jest-dom'


// describe("Given I am connected as an employee", () => {
//   describe("When I am on NewBill Page", () => {
//     test("Then ...", () => {
//       const html = NewBillUI()
//       document.body.innerHTML = html
//       //to-do write assertion

import { fireEvent, screen,  waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import '@testing-library/jest-dom'
import { localStorageMock } from "../__mocks__/localStorage.js"
import { ROUTES_PATH } from "../constants/routes.js"
import mockStore from "../__mocks__/store"

import router from "../app/Router.js"
// Mocks
jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    beforeEach(() => {
      // Mock the localStorage
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      //  // Clean up the DOM
      //  document.body.innerHTML = '';
    })

    test("Then the new bill form should be displayed correctly", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      
      // Check if all required
      const testsId = [
        'expense-type',
        'expense-name',
        'datepicker',
        'amount',
        'vat',
        'pct',
        'commentary',
        'file'
      ]

      testsId.forEach(testId => {
        const testIdElement = screen.getByTestId(testId)
        expect(testIdElement).toBeInTheDocument()
      })

      // Vérifiez les options du select
      const options = [
        'Transports',
        'Restaurants et bars',
        'Hôtel et logement',
        'Services en ligne',
        'IT et électronique',
        'Equipement et matériel',
        'Fournitures de bureau'
      ]

      options.forEach(option => {
        expect(screen.getByText(option)).toBeInTheDocument()
      })
    })

    test("Then handleSubmit should be called on form submit", () => {
      const onNavigate = jest.fn()
      const store = {
        bills: () => ({
          create: jest.fn().mockResolvedValue({ fileUrl: 'url', key: 'key' }),
          update: jest.fn().mockResolvedValue()
        })
      }
      const html = NewBillUI()
      document.body.innerHTML = html
      const newBill = new NewBill({ document, onNavigate, store, localStorage: window.localStorage })

      const form = screen.getByTestId('form-new-bill')
      fireEvent.submit(form)
      
      expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH['Bills'])
    })
    
    test("Then handleChangeFile should be called on file input change", async () => {

      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.NewBill);
    
      // Créer une instance de NewBill après avoir navigué à la bonne page
      const store = {
        bills: () => ({
          create: jest.fn().mockResolvedValue({ fileUrl: 'url', key: 'key' }),
          update: jest.fn().mockResolvedValue()
        })
      };
      const newBill = new NewBill({ document, onNavigate, store, localStorage: window.localStorage });
    
      // Espionner la méthode handleChangeFile
      const handleChangeFileSpy = jest.spyOn(newBill, 'handleChangeFile');
      
      // Sélectionner tous les inputs file et utiliser le premier
      const fileInputs = screen.getAllByTestId('file');
      const fileInput = fileInputs[0];
      //ligne ajouter
      fileInput.addEventListener("change", newBill.handleChangeFile);
      
      // Créer un fichier de test et simuler le changement de fichier
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(fileInput, 'files', {
        value: [file],
      });
      fireEvent.change(fileInput);
    
      // Vérifier que les valeurs ont été assignées correctement
      await waitFor(() => {
        expect(handleChangeFileSpy).toHaveBeenCalled();
        expect(newBill.fileUrl).toBe('url');
        // expect(newBill.fileName).toBe('test.jpg');
      });

    //   const onNavigate = jest.fn()
    //   const store = {
    //     bills: () => ({
    //       create: jest.fn().mockResolvedValue({ fileUrl: 'url', key: 'key' })
    //     })
    //   }
    //   const html = NewBillUI()
    //   document.body.innerHTML = html
    
    //   const newBill = new NewBill({ document, onNavigate, store, localStorage: window.localStorage })
    //   const handleChangeFileSpy = jest.spyOn(newBill, 'handleChangeFile')
    //   const fileInput = screen.getByTestId('file')
      
    //   const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    //   Object.defineProperty(fileInput, 'files', {
    //     value: [file],
    //   })
    //   fireEvent.change(fileInput)
    
    //   // Verify that the values have been assigned correctly
    //   await waitFor(() => {
    //     expect(handleChangeFileSpy).toHaveBeenCalled()
    //     expect(newBill.fileUrl).toBe('url')
    //     expect(newBill.fileName).toBe('test.png')
    //   })
    });
  })
}) 