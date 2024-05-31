document.addEventListener('DOMContentLoaded', () => {
    const addProductButton = document.getElementById('add-product');
    const addProductForm = document.querySelector('.add-product-form') as HTMLElement;
    const editProductForm = document.querySelector('.edit-product-form') as HTMLElement;
    const closeAddFormButton = document.querySelector('#close-form') as HTMLElement;
    const closeEditFormButton = document.querySelector('#close-fm') as HTMLElement;
    const productTable = document.querySelector('.products-table table') as HTMLElement;
    const productTableBody = document.querySelector('.products-table table tbody') as HTMLElement;
    const productDetailsOverlay = document.getElementById('overlay');
    let productDetailsContent = document.getElementById('product-details-content');
    const productsContainer = document.getElementById('products') as HTMLElement;
    const closeOverlayButton = document.getElementById('close-overlay');
    const cartItems = document.getElementById('cart-items') as HTMLElement;
    const generateUniqueId = () => {
        return `cart-item-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    };
    const displayProducts = (productsData: any) => {
        productsContainer.innerHTML = '';
        if(productsData){
            productsData.forEach((product: any) => {
                const productElement = document.createElement('div');
                productElement.classList.add('product');
                productElement.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h1>${product.name}</h1>
                    <p>${product.description}</p>
                    <p>${product.price}</p>
                    <label for="quantity-${product.id}">Quantity:</label>
                    <input id="quantity-${product.id}"name="quantity" type="number" value="1" min="1" max="100">
                    <div style="margin:5%">
                    <button>See Details</button>
                    <button id="add-to-cart-${product.id}" class="add-to-cart">Add to Cart</button>
                    </div>
                `;
                productsContainer.appendChild(productElement);
    
                const addToCartButton = document.getElementById(`add-to-cart-${product.id}`);
                const quantityInput = document.getElementById(`quantity-${product.id}`) as HTMLInputElement;
                if (addToCartButton && quantityInput) {
                    addToCartButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        addToCart(product, parseInt(quantityInput.value));
                    });
                }
            });
        }
    }
    
    const addToCart = (product: any, quantity:number) => {
       console.log('Add to cart:', product);
       const cartItem = {
        ...product,
        quantity,
        id: generateUniqueId()
        
       };
       fetch('http://localhost:3001/cart', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(cartItem),
       })
         .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
       
    }
    
    const fetchCart = () => {
        console.log('Fetching cart');
        
        fetch('http://localhost:3001/cart')
            .then(response => response.json())
            .then(data => {
                console.log('Cart:', data);
                displayCart(data);
                
            })
            .catch(error => console.error('Error fetching cart:', error));
    }
    
    const displayCart = (cartData: any) => {
        console.log('Display cart:', cartData);
        
        cartItems.innerHTML = '';
        cartData.forEach((cartItem: any) => {
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <img src="${cartItem.image}" alt="${cartItem.name}">
                <h1>${cartItem.name}</h1>
                <p>${cartItem.description}</p>
                <p>${cartItem.price * cartItem.quantity}</p>
                <p>Quantity: ${cartItem.quantity}</p>
                <button id="remove-from-cart-${cartItem.id}" class="remove-from-cart">Remove</button>
            `;
            cartItems.appendChild(cartItemElement);
    
            const removeFromCartButton = document.getElementById(`remove-from-cart-${cartItem.id}`);
            if (removeFromCartButton) {
                removeFromCartButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    removeFromCart(cartItem);
                });
            }
        });
    }
    fetchCart();

    const removeFromCart = (cartItem: any) => {
        console.log('Remove from cart:', cartItem);
        fetch(`http://localhost:3001/cart/${cartItem.id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                fetchCart();
            } else {
                console.error('Error deleting cart item');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    
const fetchProducts = () => {
    fetch('http://localhost:3001/products')
        .then(response => response.json())
        .then(data => {
            console.log('Products:', data);
            
            displayProducts(data);
        })
        .catch(error => console.error('Error fetching products:', error));
}
fetchProducts();
    const fetchAndDisplayProducts = () => {
        fetch('http://localhost:3001/products')
            .then(response => response.json())
            .then(data => {
                
                productTableBody.innerHTML = '';

                data.forEach((product: any) => {
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
                (field as HTMLInputElement).value = '';
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
            const target = event.target as HTMLElement;
    
            if (target && target.classList.contains('edit-button')) {
                const row = target.closest('tr');
    
                if (row) {
                    const productId = row.dataset.id;
                    const rowData = Array.from(row.cells).map(cell => cell.innerText);
                    const formFields = editProductForm.querySelectorAll('input');
    
                    formFields.forEach((field, index) => {
                        if (index < rowData.length - 1) {
                            (field as HTMLInputElement).value = rowData[index];
                        }
                    });
    
                    const imageInput = editProductForm.querySelector('input[name="product-image"]') as HTMLInputElement;
                    const imageCell = row.querySelector('td:nth-child(4)');
                    if (imageCell && imageInput) {
                        const imageElement = imageCell.querySelector('img');
                        if (imageElement) {
                            imageInput.value = imageElement.src;
                        }
                    }

                    let hiddenIdField = editProductForm.querySelector('input[name="product-id"]') as HTMLInputElement;
                    if (!hiddenIdField) {
                        hiddenIdField = document.createElement('input');
                        hiddenIdField.type = 'hidden';
                        hiddenIdField.name = 'product-id';
                        const formElement = editProductForm.querySelector('form');
                        if (formElement) {
                            formElement.appendChild(hiddenIdField);
                        }
                    }
                    hiddenIdField.value = productId ?? '';

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
                        } else {
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
                const productId = formData.get('product-id') as string;
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
            const target = event.target as HTMLElement;
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
   