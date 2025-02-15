describe('E2E Test - Compra de Producto', () => {
    it('Debe iniciar sesión, añadir producto al carrito y enviar la orden', () => {

        let access_token, role, token_id;

        cy.visit('/login');

        let email = 'user@example.com';
        let password = 'Password123'

        cy.get('input[name="email"]').type(email);
        cy.get('input[name="password"]').type(password);
        cy.get('button[type="submit"]').click();

        cy.request('POST', Cypress.env('API_URL') + '/api/auth/login', {
            email,
            password
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data).to.have.property('access_token');

            access_token = response.body.data.access_token;
            token_id = response.body.data.token_id;
            role = response.body.data.role;

            if (role !== "cliente") {
                cy.log('El usuario no puede realizar pedidos, test finalizado');
                return;
            }
        });

        cy.request('GET', Cypress.env('API_URL') + '/api/products')
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.data).to.be.an('array');

                let productWithStock;

                if (response.body.data.length === 0) {
                    cy.log('No hay productos disponibles, test finalizado');
                    return;
                } else {
                    productWithStock = response.body.data.find((product) => product.stock > 0);
                    if (!productWithStock) {
                        cy.log('No hay productos con stock disponible, test finalizado');
                        return;
                    }
                }

                const product = productWithStock;

                cy.visit(`/productdetails/${product.id}`);

                cy.request(Cypress.env('API_URL') + `/api/products/${product.id}`).then((prodRes) => {

                    expect(prodRes.status).to.eq(200);

                    // Verifica que el producto coincida con la respuesta del backend (de la lista de productos y el individual) con del frontend

                    expect(product).to.deep.equal(prodRes.body.data);

                    cy.get('.inner-title').should('contain', prodRes.body.data.name);
                    cy.get('.top-title').should('contain', prodRes.body.data.name);

                    expect(prodRes.body.data).to.have.property('stock');

                    let cart = [];

                    cy.window().then((win) => {
                        cart.push({
                            product: prodRes.body.data,
                            amount: prodRes.body.data.stock,
                            discount: prodRes.body.data.discount
                        });
                        win.localStorage.setItem('cart', JSON.stringify(cart));
                    });

                    cy.visit('/shop-list');

                    // Verifica que el carrito coincida con lo guardado en localStorage

                    cy.get(':nth-child(2) > article > table > tbody > tr > th').should('contain', prodRes.body.data.name);
                    cy.get(':nth-child(2) > article > table > tbody > tr > :nth-child(2)').should('contain', prodRes.body.data.prices.at(-1).price);
                    cy.get(':nth-child(2) > article > table > tbody > tr > :nth-child(4)').should('contain', prodRes.body.data.stock);

                    cy.window().then((win) => {
                        cy.request('POST', Cypress.env('API_URL') + `/api/tickets`, {
                            access_token: access_token,
                            product_amounts: [{
                                product: prodRes.body.data.id,
                                amount: prodRes.body.data.stock
                            }]
                        }).then((ticketRes) => {
                            expect(ticketRes.status).to.eq(201);
                            win.localStorage.setItem('cart', JSON.stringify([]));
                            cy.visit('/shop-list');
                        });
                    });
                });
            });
    });
});
