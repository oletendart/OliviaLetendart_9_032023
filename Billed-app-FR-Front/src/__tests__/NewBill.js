/**
 * @jest-environment jsdom
 */

import {fireEvent, screen, waitFor} from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import mockStore from "../__mocks__/store.js"
import {localStorageMock} from "../__mocks__/localStorage.js";
import router from "../app/Router.js";
import {ROUTES_PATH, ROUTES} from "../constants/routes.js";


describe("Given I am connected as an employee", () => {
    describe("When I am on NewBill Page", () => {
        describe("When I change file to a valid file", () => {
            test('Then Should call method handleChangeFile', async () => {
                Object.defineProperty(window, localStorage, {value: localeStorageMock})
                window.localStorage.setItem('user', JSON.stringify({
                    type: 'Employee'
                }))
                const root = document.createElement("div")
                root.setAttribute("id", "root")
                document.body.append(root)
                router()
                window.onNavigate(ROUTES_PATH.NewBill)

                const onNavigate = pathname => {
                    document.body.innerHTML = ROUTES({pathname})
                }

                let NewBillInstance = new NewBill({
                    document,
                    onNavigate,
                    store: null,
                    localStorage: window.localStorage
                })

                const spyHandleChangeFile = jest.spyOn(NewBillInstance, "handleChangeFile")

                let changeFileBtn = await waitFor(() => screen.getByTestId('file'))

                fireEvent.click(changeFileBtn, () => {
                    expect(spyHandleChangeFile).toHaveBeenCalled()
                });

            })

            test("Then should create a new file", async () => {
                Object.defineProperty(window, 'localStorage', {value: localStorageMock})
                window.localStorage.setItem('user', JSON.stringify({
                    type: 'Employee',
                    email: 'Employee@billed.com'
                }))

                const root = document.createElement("div")
                root.setAttribute("id", "root")
                document.body.append(root)
                router()
                window.onNavigate((ROUTES_PATH.NewBill))

                const onNavigate = pathname => {
                    document.body.innerHTML = ROUTES({pathname})
                }

                let NewBillInstance = new NewBill({
                    document,
                    onNavigate,
                    store: mockStore,
                    localStorage: window.localStorage
                })

                let billMocked = {
                    "id": "UnnsnsKDPAnsajjiwemqneodjna",
                    "name": "test666",
                    "email": "a@a",
                    "type": "Services en ligne",
                    "vat": "60",
                    "pct": 20,
                    "commentAdmin": "ça marche !",
                    "amount": 300,
                    "status": "accepted",
                    "date": "2023-05-31",
                    "commentary": "",
                    "fileName": "facture-client-php-exportee-dans-document-pdf-enregistre-sur-disque-dur.png",
                    "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…dur.png?alt=media&token=571d34cb-9c8f-430a-af52-66221cae1da3"
                }

                const fileList = {0: billMocked, length: 1, item: () => billMocked};
                const fileInput = {files: fileList, value: "test.png"};
                const changeEvent = {preventDefault: jest.fn(), target: fileInput};

                const mockStoreCreateSpy = jest.spyOn(mockStore.bills(), 'create');
                await waitFor(() => jest.fn(NewBillInstance.handleChangeFile(changeEvent)))

                expect(mockStoreCreateSpy).toHaveBeenCalled();

            })
        })

        describe("When I change file to a not valid file", () => {
            test("Then should return an error message", async () => {
                
            })
        })

    })
})
