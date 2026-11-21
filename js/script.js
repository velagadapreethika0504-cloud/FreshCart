
function toggleSettings() {
    const menu = document.getElementById("settingsMenu");

    if (menu) {
        menu.classList.toggle("show");
    }
}

function changeCustomerName() {
    let newName = prompt("Enter your new name:");

    if (!newName || !newName.trim()) {
        return;
    }

    newName = newName.trim();

    let user = JSON.parse(
        localStorage.getItem("freshCartLoggedInUser") || "null"
    );

    if (!user) return;

    user.name = newName;
    localStorage.setItem(
        "freshCartLoggedInUser",
        JSON.stringify(user)
    );

    let users = JSON.parse(
        localStorage.getItem("freshCartUsers") || "[]"
    );

    let index = users.findIndex(u => u.email === user.email);

    if (index !== -1) {
        users[index].name = newName;
        localStorage.setItem("freshCartUsers", JSON.stringify(users));
    }

    alert("Name changed successfully!");
    location.reload();
}

function changeCustomerPassword() {
    let user = JSON.parse(
        localStorage.getItem("freshCartLoggedInUser") || "null"
    );

    if (!user) return;

    let users = JSON.parse(
        localStorage.getItem("freshCartUsers") || "[]"
    );

    let index = users.findIndex(u => u.email === user.email);

    if (index === -1) {
        alert("User account not found!");
        return;
    }

    let oldPassword = prompt("Enter current password:");

    if (oldPassword !== users[index].password) {
        alert("Current password is incorrect!");
        return;
    }

    let newPassword = prompt("Enter new password:");

    if (!newPassword || newPassword.trim().length < 6) {
        alert("Password must contain at least 6 characters!");
        return;
    }

    users[index].password = newPassword.trim();

    localStorage.setItem("freshCartUsers", JSON.stringify(users));

    alert("Password changed successfully!");
}

function logoutUser() {
    localStorage.removeItem("freshCartLoggedInUser");
    alert("Logged out successfully!");
    window.location.href = "index.html";
}
