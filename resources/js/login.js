// console.log("");
let input = document.getElementById("password");

function gantiIcon(par) {
    if (par == true) {
        inputLogo.classList.remove("fa-eye-slash");
        inputLogo.classList.add("fa-eye");
    } else {
        inputLogo.classList.remove("fa-eye");
        inputLogo.classList.add("fa-eye-slash");
    }
}

let inputLogo = document.getElementById("passwordLogo");
input.addEventListener("input", (event) => {
    if (input.value !== "") {
        gantiIcon(false);
    } else {
        gantiIcon(true);
    }
});
inputLogo.addEventListener("click", (e) => {
    console.log(input.type);
    if (inputLogo.classList.contains("fa-eye-slash")) {
        input.type = "text";
        gantiIcon(true);
    } else if (inputLogo.classList.contains("fa-eye")) {
        input.type = "password";
        gantiIcon(false);
    }
});
