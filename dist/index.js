"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const addProductButton = document.getElementById('add-product');
    const addProductForm = document.querySelector('.add-product-form');
    const editProductForm = document.querySelector('.edit-product-form');
    const closeAddFormButton = document.querySelector('#close-form');
    const closeEditFormButton = document.querySelector('#close-fm');
    const productTable = document.querySelector('.products-table table');
    const productTableBody = document.querySelector('.products-table table tbody');
    const productDetailsOverlay = document.getElementById('overlay');
    let productDetailsContent = document.getElementById('product-details-content');
    const productsContainer = document.getElementById('products');
    const closeOverlayButton = document.getElementById('close-overlay');
    const displayProducts = (productsData) => {
        productsContainer.innerHTML = '';
        if (productsData) {
            productsData.forEach((product) => {
                const productElement = document.createElement('div');
                productElement.classList.add('product');
                productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h1>${product.name}</h1>
            <p>${product.description}</p>
            <p>${product.price}</p>
            <button>See Details</button>
            <button id="add-to-cart">Add to Cart</button>
        `;
                productsContainer.appendChild(productElement);
            });
        }
    };
    const fetchProducts = () => {
        fetch('http://localhost:3001/products')
            .then(response => response.json())
            .then(data => {
            console.log('Products:', data);
            displayProducts(data);
        })
            .catch(error => console.error('Error fetching products:', error));
    };
    fetchProducts();
    const fetchAndDisplayProducts = () => {
        fetch('http://localhost:3001/products')
            .then(response => response.json())
            .then(data => {
            productTableBody.innerHTML = '';
            data.forEach((product) => {
                const row = document.createElement('tr');
                row.dataset.id = product.id;
                row.innerHTML = `
                        <td>${product.name}</td>
                        <td>${product.description}</td>
                        <td>Ksh. ${product.price}</td>
                        <td><img src="${product.image}" alt="${product.name}"></td>
                        <td>
                            <button class="edit-button">Edit</button>
                            <button class="delete-button">Delete</button>
                        </td>
                    `;
                productTableBody.appendChild(row);
            });
        })
            .catch(error => console.error('Error fetching products:', error));
    };
    fetchAndDisplayProducts();
    if (addProductButton && addProductForm) {
        addProductButton.addEventListener('click', () => {
            const formFields = addProductForm.querySelectorAll('input');
            formFields.forEach(field => {
                field.value = '';
            });
            addProductForm.style.display = 'block';
            editProductForm.style.display = 'none';
        });
    }
    if (addProductForm) {
        const formElement = addProductForm.querySelector('form');
        if (formElement) {
            formElement.addEventListener('submit', (event) => {
                event.preventDefault();
                const formData = new FormData(formElement);
                const productData = {
                    name: formData.get('product-name'),
                    description: formData.get('product-description'),
                    price: formData.get('product-price'),
                    image: formData.get('product-image')
                };
                fetch('http://localhost:3001/products', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(productData),
                })
                    .then(response => response.json())
                    .then(data => {
                    console.log('Success:', data);
                    addProductForm.style.display = 'none';
                    fetchAndDisplayProducts();
                    fetchProducts();
                })
                    .catch((error) => {
                    console.error('Error:', error);
                });
            });
        }
    }
    if (productTable) {
        productTable.addEventListener('click', (event) => {
            const target = event.target;
            if (target && target.classList.contains('edit-button')) {
                const row = target.closest('tr');
                if (row) {
                    const productId = row.dataset.id;
                    const rowData = Array.from(row.cells).map(cell => cell.innerText);
                    const formFields = editProductForm.querySelectorAll('input');
                    formFields.forEach((field, index) => {
                        if (index < rowData.length - 1) {
                            field.value = rowData[index];
                        }
                    });
                    const imageInput = editProductForm.querySelector('input[name="product-image"]');
                    const imageCell = row.querySelector('td:nth-child(4)');
                    if (imageCell && imageInput) {
                        const imageElement = imageCell.querySelector('img');
                        if (imageElement) {
                            imageInput.value = imageElement.src;
                        }
                    }
                    let hiddenIdField = editProductForm.querySelector('input[name="product-id"]');
                    if (!hiddenIdField) {
                        hiddenIdField = document.createElement('input');
                        hiddenIdField.type = 'hidden';
                        hiddenIdField.name = 'product-id';
                        const formElement = editProductForm.querySelector('form');
                        if (formElement) {
                            formElement.appendChild(hiddenIdField);
                        }
                    }
                    hiddenIdField.value = productId !== null && productId !== void 0 ? productId : '';
                    editProductForm.style.display = 'block';
                    addProductForm.style.display = 'none';
                }
            }
            if (target && target.classList.contains('delete-button')) {
                const row = target.closest('tr');
                if (row) {
                    const productId = row.dataset.id;
                    fetch(`http://localhost:3001/products/${productId}`, {
                        method: 'DELETE',
                    })
                        .then(response => {
                        if (response.ok) {
                            fetchAndDisplayProducts();
                            fetchProducts();
                        }
                        else {
                            console.error('Error deleting product');
                        }
                    })
                        .catch((error) => {
                        console.error('Error:', error);
                    });
                }
            }
        });
    }
    if (editProductForm) {
        const formElement = editProductForm.querySelector('form');
        if (formElement) {
            formElement.addEventListener('submit', (event) => {
                event.preventDefault();
                const formData = new FormData(formElement);
                const productId = formData.get('product-id');
                const productData = {
                    name: formData.get('product-name'),
                    description: formData.get('product-description'),
                    price: formData.get('product-price'),
                    image: formData.get('product-image')
                };
                fetch(`http://localhost:3001/products/${productId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(productData),
                })
                    .then(response => response.json())
                    .then(data => {
                    console.log('Success:', data);
                    editProductForm.style.display = 'none';
                    fetchAndDisplayProducts();
                    fetchProducts();
                })
                    .catch((error) => {
                    console.error('Error:', error);
                });
            });
        }
    }
    if (closeAddFormButton && addProductForm) {
        closeAddFormButton.addEventListener('click', () => {
            addProductForm.style.display = 'none';
        });
    }
    if (closeEditFormButton && editProductForm) {
        closeEditFormButton.addEventListener('click', () => {
            editProductForm.style.display = 'none';
        });
    }
    if (productTable) {
        productTable.addEventListener('click', (event) => {
            const target = event.target;
            const row = target.closest('tr');
            const isEditButton = target.classList.contains('edit-button');
            const isDeleteButton = target.classList.contains('delete-button');
            if (isEditButton || isDeleteButton) {
                return;
            }
            if (row) {
                const productName = row.cells[0].innerText;
                const productDescription = row.cells[1].innerText;
                const productPrice = row.cells[2].innerText;
                const productImageElement = row.cells[3].querySelector('img');
                const productImageSrc = productImageElement ? productImageElement.src : '';
                const productId = row.dataset.id;
                const productDetailsHTML = `
                    
                    <img src="${productImageSrc}" alt="Shirt">
                    <h1>${productName}</h1>
                    <p>${productDescription}</p>
                    <p>${productPrice}</p>
                    <button id="close-overlay">Close</button>
                `;
                if (!productDetailsOverlay) {
                    productDetailsContent = document.createElement('div');
                    productDetailsContent.classList.add('product-details-content');
                    document.body.appendChild(productDetailsContent);
                }
                if (productDetailsContent && productDetailsOverlay) {
                    productDetailsContent.innerHTML = productDetailsHTML;
                    productDetailsOverlay.style.display = 'block';
                }
                const closeOverlayButton = document.getElementById('close-overlay');
                if (closeOverlayButton && productDetailsOverlay) {
                    closeOverlayButton.addEventListener('click', () => {
                        console.log('Close overlay');
                        productDetailsOverlay.style.display = 'none';
                    });
                }
            }
        });
    }
});
