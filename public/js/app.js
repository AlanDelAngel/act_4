const API_URL = '/api';
let token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', () => {
    if (token) {
        showProducts();
    } else {
        showLogin();
    }
});

function showLogin() {
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('register-container').style.display = 'none';
    document.getElementById('product-container').style.display = 'none';
}

function showRegister() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('register-container').style.display = 'block';
}

function showProducts() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('register-container').style.display = 'none';
    document.getElementById('product-container').style.display = 'block';
    loadProducts();
}

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
        localStorage.setItem('token', data.token);
        token = data.token;
        showProducts();
    } else {
        alert('Error: ' + data.message);
    }
}

async function register() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();
    if (res.ok) {
        alert('Registro exitoso, ahora inicia sesión.');
        showLogin();
    } else {
        alert('Error: ' + data.message);
    }
}

async function loadProducts() {
    const res = await fetch(`${API_URL}/products`, {
        headers: { Authorization: token }
    });

    const products = await res.json();
    const list = document.getElementById('product-list');
    list.innerHTML = '';

    products.forEach(product => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${product.name} - $${product.price}
            <button onclick="deleteProduct('${product._id}')">Eliminar</button>
        `;
        list.appendChild(li);
    });
}

async function addProduct() {
    const name = document.getElementById('product-name').value;
    const price = document.getElementById('product-price').value;
    const description = document.getElementById('product-description').value;

    const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token
        },
        body: JSON.stringify({ name, price, description })
    });

    if (res.ok) {
        loadProducts();
    } else {
        alert('Error al agregar producto.');
    }
}

async function deleteProduct(id) {
    const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: token }
    });

    if (res.ok) {
        loadProducts();
    } else {
        alert('Error al eliminar producto.');
    }
}

function logout() {
    localStorage.removeItem('token');
    token = null;
    showLogin();
}
