describe('Integration Test - Mostrar productos desde el backend', () => {
    it('debería mostrar la lista de productos en la página de inicio', () => {
      cy.intercept('GET', 'http://localhost:3000/api/products', {
        statusCode: 200,
        body: {
          data: [
            {
              "id": 1,
              "name": "Mayonesa Natura 500ml",
              "stock": 1500,
              "img": "https://ardiaprod.vtexassets.com/arquivos/ids/306990/Mayonesa-Natura-500-Ml-_1.jpg?v=638599324417500000",
              "desc": "",
              "status": "active",
              "category": {
                  "id": 1,
                  "name": "Alimentos",
                  "status": "active"
              },
              "discount": null,
              "prices": [
                  {
                      "date": "2025-02-12T15:22:09.000Z",
                      "price": 1500,
                      "product": 1
                  }
              ]
            },
            {
              "id": 2,
              "name": "Mostaza Savora 250 Gr",
              "stock": 800,
              "img": "https://jumboargentina.vtexassets.com/arquivos/ids/806733/Mostaza-Savora-Original-X250gr-1-940871.jpg?v=638403359074100000",
              "desc": "",
              "status": "active",
              "category": {
                  "id": 1,
                  "name": "Alimentos",
                  "status": "active"
              },
              "discount": null,
              "prices": [
                  {
                      "date": "2025-02-12T15:22:09.000Z",
                      "price": 1300,
                      "product": 1
                  }
              ]
            },
          ]
        }
      }).as('getProducts');
      
      cy.visit('http://localhost:4200/home');
      
      cy.wait('@getProducts');
      
      cy.get('.card').should('have.length', 2);
      
      cy.get('.card').first().within(() => {
        cy.get('.name').should('contain', 'Mayonesa Natura 500ml');
        cy.get('.price').should('contain', 1500);
      });

      cy.get('.card').last().within(() => {
        cy.get('.name').should('contain', 'Mostaza Savora 250 Gr');
        cy.get('.price').should('contain', 1300);
      });
    });
  });