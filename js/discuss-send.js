(function() {
// Inisialisasi EmailJS
emailjs.init("Jf33d7klVKhYm6uBE"); // public key

const form = document.querySelector("form");

form.addEventListener("submit", function(e) {
    e.preventDefault();

    // Kirim ke Client saja
    emailjs.sendForm(
    "service_nxj9nf6",   // EmailJS Service ID
    "template_s5l1aiq",   // Template key ID
    this,
    "Jf33d7klVKhYm6uBE"  // public key
    ).then(() => {
    console.log("Client email sent successfully");
    Swal.fire({
        icon: "success",
        title: "Thank you",
        text: "Our team will be in contact with you soon",
        confirmButtonColor: "#000"
    });
    form.reset();
    }, (err) => {
    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! Please try again later.",
        confirmButtonColor: "#000"
    });
    console.error("Client email error:", err);
    });
});
})();
