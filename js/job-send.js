(function() {
// Inisialisasi EmailJS
emailjs.init("Jf33d7klVKhYm6uBE");

const form = document.getElementById("jobEnquiryForm");

form.addEventListener("submit", function(e) {
    e.preventDefault();

    // Kirim ke client saja
    emailjs.sendForm(
    "service_nxj9nf6",      // Service ID
    "template_01u6l8v",     // Template untuk client ID
    this,
    "Jf33d7klVKhYm6uBE"     // Public Key
    ).then(() => {
    // Notifikasi sukses ke user
    Swal.fire({
        icon: "success",
        title: "Thank you",
        text: "Our team will be in contact with you soon",
        confirmButtonColor: "#000"
    });
    form.reset();
    }, (err) => {
    // Notifikasi error
    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! Please try again later.",
        confirmButtonColor: "#000"
    });
    console.error("EmailJS error:", err);
    });
});
})();
  