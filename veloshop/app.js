// Инициализация начальных данных в localStorage (эмуляция БД MySQL)
const DEFAULT_BIKES = [
    { id: 1, name: "Stels Navigator 930 MD", category: "Горный (MTB)", wheel: "29\"", stock: 12, price: 34900, desc: "Алюминиевая рама, 21 скорость, дисковые тормоза." },
    { id: 2, name: "Forward Apache 27.5", category: "Горный (MTB)", wheel: "27.5\"", stock: 8, price: 28500, desc: "Надежный хардтейл для пересеченной местности и города." },
    { id: 3, name: "Merida Scultura 100", category: "Шоссейный", wheel: "28\"", stock: 4, price: 79000, desc: "Легкая карбоновая вилка, трансмиссия Shimano Claris." },
    { id: 4, name: "Shulz Goa-3", category: "Городской складной", wheel: "20\"", stock: 15, price: 39200, desc: "Планетарная втулка на 3 скорости, компактное сложение." },
    { id: 5, name: "Author Ronin Gravel", category: "Гравийный", wheel: "28\"", stock: 5, price: 94500, desc: "Хромомолибденовая рама для дальних путешествий." },
    { id: 6, name: "GT Aggressor Sport", category: "Горный (MTB)", wheel: "27.5\"", stock: 10, price: 42000, desc: "Фирменная геометрия Triple Triangle, амортизация 80 мм." }
];

const DEFAULT_USERS = [
    { login: "admin", password: "admin", role: "admin", fio: "Администраторов Иван Сергеевич", phone: "+7 (473) 200-11-22", address: "г. Воронеж, Московский пр-т, д. 14" },
    { login: "user", password: "1234", role: "user", fio: "Петров Алексей Владимирович", phone: "+7 (900) 555-35-35", address: "г. Воронеж, ул. Плехановская, д. 28, кв. 12" }
];

const DEFAULT_GUESTBOOK = [
    { id: 1, type: "Благодарность", category: "Горные велосипеды", author: "Смирнов", email: "smirnov@mail.ru", text: "Отличный магазин! Помогли подобрать ростовку рамы Stels Navigator.", date: "15.11.2026" },
    { id: 2, type: "Вопрос", category: "Доставка и оплата", author: "Козлова", email: "kozlova_v@yandex.ru", text: "Подскажите, есть ли бесплатное первое ТО после покупки?", date: "18.11.2026" }
];

function initDB() {
    if (!localStorage.getItem("vm_bikes")) {
        localStorage.setItem("vm_bikes", JSON.stringify(DEFAULT_BIKES));
    }
    if (!localStorage.getItem("vm_users")) {
        localStorage.setItem("vm_users", JSON.stringify(DEFAULT_USERS));
    }
    if (!localStorage.getItem("vm_orders")) {
        localStorage.setItem("vm_orders", JSON.stringify([
            { id: 101, date: "2026-11-18", user: "user", customerName: "Петров Алексей Владимирович", items: "Forward Apache 27.5 (1 шт.)", total: 28500, delivery: "Да" }
        ]));
    }
    if (!localStorage.getItem("vm_guestbook")) {
        localStorage.setItem("vm_guestbook", JSON.stringify(DEFAULT_GUESTBOOK));
    }
}

function getBikes() { return JSON.parse(localStorage.getItem("vm_bikes") || "[]"); }
function saveBikes(data) { localStorage.setItem("vm_bikes", JSON.stringify(data)); }

function getUsers() { return JSON.parse(localStorage.getItem("vm_users") || "[]"); }
function saveUsers(data) { localStorage.setItem("vm_users", JSON.stringify(data)); }

function getOrders() { return JSON.parse(localStorage.getItem("vm_orders") || "[]"); }
function saveOrders(data) { localStorage.setItem("vm_orders", JSON.stringify(data)); }

function getGuestbook() { return JSON.parse(localStorage.getItem("vm_guestbook") || "[]"); }
function saveGuestbook(data) { localStorage.setItem("vm_guestbook", JSON.stringify(data)); }

function getCurrentUser() {
    return JSON.parse(sessionStorage.getItem("vm_current_user") || "null");
}

// 1. JS-сервис: Приветствие по времени суток и живые часы
function updateGreetingAndClock() {
    const now = new Date();
    const hour = now.getHours();
    let greeting = "Доброй ночи";
    if (hour >= 5 && hour < 12) greeting = "Доброе утро";
    else if (hour >= 12 && hour < 18) greeting = "Добрый день";
    else if (hour >= 18 && hour < 23) greeting = "Добрый вечер";

    const timeStr = now.toLocaleTimeString("ru-RU");
    const dateStr = now.toLocaleDateString("ru-RU");

    const greetEl = document.getElementById("js-greeting");
    const clockEl = document.getElementById("js-clock");
    if (greetEl) greetEl.textContent = `${greeting}, посетитель!`;
    if (clockEl) clockEl.textContent = `Дата: ${dateStr} | Время: ${timeStr}`;
}

// 2. JS-сервис: Отрисовка блока авторизации в сайдбаре
function renderAuthWidget() {
    const box = document.getElementById("auth-widget");
    if (!box) return;
    const user = getCurrentUser();

    if (user) {
        box.innerHTML = `
            <h3>Личный кабинет</h3>
            <p>Вы вошли как: <strong>${user.login}</strong> (${user.role === "admin" ? "Администратор" : "Покупатель"})</p>
            <p style="font-size:13px; margin:6px 0;">${user.fio}</p>
            ${user.role === "admin" ? `<a href="admin.html" class="btn btn-success" style="width:100%; text-align:center; margin-bottom:8px;">Админ-панель</a>` : ""}
            <button onclick="logoutUser()" class="btn btn-danger" style="width:100%;">Выйти</button>
        `;
    } else {
        box.innerHTML = `
            <h3>Авторизация</h3>
            <div class="form-group">
                <label>Логин</label>
                <input type="text" id="auth-login" placeholder="admin или user">
            </div>
            <div class="form-group">
                <label>Пароль</label>
                <input type="password" id="auth-pass" placeholder="admin или 1234">
            </div>
            <button onclick="loginUser()" class="btn" style="width:100%; margin-bottom:8px;">Войти</button>
            <button onclick="showRegModal()" class="btn btn-secondary" style="width:100%;">Регистрация</button>
            <p style="font-size:12px; color:#64748b; margin-top:8px;">Демо: <b>admin / admin</b> или <b>user / 1234</b></p>
        `;
    }
}

function loginUser() {
    const login = document.getElementById("auth-login").value.trim();
    const pass = document.getElementById("auth-pass").value.trim();

    if (!login || !pass) {
        alert("Ошибка: введите логин и пароль!");
        return;
    }
    const found = getUsers().find(u => u.login === login && u.password === pass);
    if (!found) {
        alert("Введенные вами логин или пароль неверны!");
        return;
    }
    sessionStorage.setItem("vm_current_user", JSON.stringify(found));
    location.reload();
}

function logoutUser() {
    sessionStorage.removeItem("vm_current_user");
    location.href = "index.html";
}

function showRegModal() {
    const login = prompt("Придумайте логин:");
    if (!login) return;
    const password = prompt("Придумайте пароль:");
    if (!password) return;
    const fio = prompt("Введите ФИО (только кириллица):");
    if (!fio || !/^[А-Яа-яЁё\s-]+$/.test(fio)) {
        alert("Ошибка: ФИО должно содержать только русские буквы!");
        return;
    }
    const phone = prompt("Введите телефон:", "+7 (900) 000-00-00");
    const address = prompt("Введите адрес доставки:", "г. Воронеж, ул. Ленина, д. 1");

    const users = getUsers();
    if (users.some(u => u.login === login)) {
        alert("Пользователь с таким логином уже существует!");
        return;
    }
    const newUser = { login, password, role: "user", fio, phone: phone || "", address: address || "" };
    users.push(newUser);
    saveUsers(users);
    sessionStorage.setItem("vm_current_user", JSON.stringify(newUser));
    alert("Регистрация успешно завершена!");
    location.reload();
}

// 3. JS-сервис: Калькулятор подбора рамы велосипеда
function calculateFrameSize() {
    const height = parseInt(document.getElementById("rider-height").value, 10);
    const resEl = document.getElementById("frame-result");
    if (isNaN(height) || height < 130 || height > 220) {
        alert("Введите корректный рост от 130 до 220 см!");
        return;
    }
    let size = "";
    if (height < 155) size = "XS (13–14 дюймов)";
    else if (height < 165) size = "S (15–16 дюймов)";
    else if (height < 175) size = "M (17–18 дюймов)";
    else if (height < 185) size = "L (19–20 дюймов)";
    else if (height < 195) size = "XL (21–22 дюйма)";
    else size = "XXL (23–24 дюйма)";

    resEl.innerHTML = `Рекомендуемый размер рамы: <strong style="color:#16a34a;">${size}</strong>`;
}

// SVG-иллюстрация велосипеда (чтобы карточки выглядели красиво без внешних картинок)
function getBikeSVG(color = "#1d4ed8") {
    return `
    <svg width="180" height="100" viewBox="0 0 180 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="70" r="24" stroke="#1e293b" stroke-width="5"/>
        <circle cx="40" cy="70" r="4" fill="#1e293b"/>
        <circle cx="140" cy="70" r="24" stroke="#1e293b" stroke-width="5"/>
        <circle cx="140" cy="70" r="4" fill="#1e293b"/>
        <path d="M40 70L75 35H118L140 70M75 35L90 70H40M118 35L90 70M75 35L68 20H58M118 35L114 18H126" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
}

document.addEventListener("DOMContentLoaded", () => {
    initDB();
    updateGreetingAndClock();
    setInterval(updateGreetingAndClock, 1000);
    renderAuthWidget();
});