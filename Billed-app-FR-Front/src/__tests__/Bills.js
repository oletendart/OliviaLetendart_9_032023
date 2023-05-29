/**
 * @jest-environment jsdom
 */

import {screen, waitFor, fireEvent, wait} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import {bills} from "../fixtures/bills.js"
import {ROUTES, ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";

import router from "../app/Router.js";
import mockStore from "../__mocks__/store.js";
import userEvent from "@testing-library/user-event";
import window from "../assets/svg/window.js";
import Bills from "../containers/Bills.js";

jest.mock("../app/store", () => mockStore);

describe("Given I am connected as an employee", () => {
    describe("When I am on Bills Page", () => {
        test("Then bill icon in vertical layout should be highlighted", async () => {
            Object.defineProperty(window, 'localStorage', {value: localStorageMock})
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))
            const root = document.createElement("div")
            root.setAttribute("id", "root")
            document.body.append(root)
            router()
            window.onNavigate(ROUTES_PATH.Bills)
            await waitFor(() => screen.getByTestId('icon-window'))
            const windowIcon = screen.getByTestId('icon-window')
            //to-do write expect expression
            expect(windowIcon.classList.contains('active-icon')).toBeTruthy();

        })
        test("Then bills should be ordered from earliest to latest", () => {
            document.body.innerHTML = BillsUI({data: bills})
            const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
            const antiChrono = (a, b) => ((a < b) ? 1 : -1)
            const datesSorted = [...dates].sort(antiChrono)
            expect(dates).toEqual(datesSorted)
        })
        describe("When I click on new bill button", () => {
            test("Then should redirect to newBill page", async () => {
                Object.defineProperty(window, 'localStorage', {value: localStorageMock})
                window.localStorage.setItem('user', JSON.stringify({
                    type: 'Employee'
                }))
                const root = document.createElement("div")
                root.setAttribute("id", "root")
                document.body.append(root)
                router()
                window.onNavigate(ROUTES_PATH.Bills)

                const onNavigate = (pathname) => {
                    document.body.innerHTML = ROUTES({pathname});
                };

                let NewBills = new Bills({
                    document,
                    onNavigate,
                    store: null,
                    bills: bills,
                    localStorage: window.localStorage,
                });

                const spyHandleClickNewBill = jest.spyOn(NewBills, 'handleClickNewBill')

                let newBillButton = await waitFor(() => screen.getByTestId('btn-new-bill'))

                fireEvent.click(newBillButton, () => {
                    expect(spyHandleClickNewBill).toHaveBeenCalled();
                });

                expect(screen.getByText('Envoyer une note de frais')).toBeTruthy()
            })
        })

        describe("When I click on eye icon button", () => {
            test("Then should open modal", async () => {
                Object.defineProperty(window, 'localStorage', {value: localStorageMock})
                window.localStorage.setItem('user', JSON.stringify({
                    type: 'Employee'
                }))
                const root = document.createElement("div")
                root.setAttribute("id", "root")
                document.body.append(root)
                router()

                window.onNavigate(ROUTES_PATH.Bills)

                const onNavigate = (pathname) => {
                    document.body.innerHTML = ROUTES({pathname});
                };

                const NewBills = new Bills({
                    document,
                    onNavigate,
                    store: null,
                    bills: bills,
                    localStorage: window.localStorage,
                });

                /* Mock fonction JQuery native modal */
                $.fn.modal = jest.fn();

                document.body.innerHTML = BillsUI({data: bills});

                const iconEye = screen.getAllByTestId("btn-new-bill").shift();
                const handleClickIconEye = jest.fn(NewBills.handleClickIconEye(iconEye));

                iconEye.addEventListener("click", handleClickIconEye);
                fireEvent.click(iconEye);

                expect(handleClickIconEye).toHaveBeenCalled();
                expect($.fn.modal).toHaveBeenCalled();
            })
        })

    })

    // API Get Bills

    describe("When Employee Navigate on Bills Dashboard", () => {
        beforeEach(() => {
            jest.spyOn(mockStore, "bills");
            Object.defineProperty(window, "localStorage", {
                value: localStorageMock
            });
            window.localStorage.setItem(
                "user",
                JSON.stringify({
                    type: "Employee",
                    email: "a@a"
                })
            );

            const root = document.createElement("div");
            root.setAttribute("id", "root");
            document.body.appendChild(root);
            router();
        })

        test('fetches bills from an API and fails with 404 message error', async () => {
            mockStore.bills.mockImplementationOnce(() => {
                return {
                    list: () => {
                        return Promise.reject(new Error("Erreur 404"));
                    },
                };
            });
            window.onNavigate(ROUTES_PATH.Bills);
            await new Promise(process.nextTick);

            const message = await screen.getByText(/Erreur 404/);
            expect(message).toBeTruthy();
        })

    });

    test('fetches messages from en API and fails with 500 message error', async () => {
        mockStore.bills.mockImplementationOnce(() => {
            return {
                list: () => {
                    return Promise.reject(new Error("Erreur 500"))
                }
            }
        })

        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick)

        const message = await screen.getByText(/Erreur 500/);
        expect(message).toBeTruthy();

    })

    test('fetches bills from an API', async () => {
        const bills = await mockStore.bills().list();
        expect(bills.length).toBe(4)
    })


    /*test("Then click on button new bill should redirect on page new bill", async () => {
        Object.defineProperty(window, 'localStorage', {value: localStorageMock})
        window.localStorage.setItem('user', JSON.stringify({
            type: 'Employee',
            email: 'e@e.tld'
        }))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.append(root)
        router()
        window.onNavigate(ROUTES_PATH.Bills)
        let btnNewBill = screen.getByTestId('btn-new-bill')
        btnNewBill.click();
        expect(await waitFor(() => screen.getByText('Envoyer une note de frais'))).toBeTruthy()
    })
})
})
*/
})
