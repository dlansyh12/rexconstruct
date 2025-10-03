(function() {
emailjs.init("Jf33d7klVKhYm6uBE"); // Public Key

const form = document.getElementById("form"); // form Discuss

form.addEventListener("submit", function(e) {
    e.preventDefault();

    // Ambil semua input
    const firstname   = form.firstname.value.trim();
    const lastname    = form.lastname.value.trim();
    const email       = form.email.value.trim();
    const phone       = form.phone.value.trim();
    const address     = form.address.value.trim();
    const projectType = form.projectType.value.trim();
    const timeline    = form.timeline.value.trim();
    const referral    = form.referral.value.trim();
    const message     = form.message.value.trim();

    // Validasi required fields
    if (!firstname || !lastname || !email || !phone || !address || !projectType || !timeline || !referral || !message) {
    Swal.fire({
        icon: "warning",
        title: "Incomplete Data",
        text: "Please fill in all required fields before submitting.",
        confirmButtonColor: "#000"
    });
    return;
    }

    // Validasi format email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
    Swal.fire({
        icon: "warning",
        title: "Invalid Email",
        text: "Please enter a valid email address.",
        confirmButtonColor: "#000"
    });
    return;
    }

    // Validasi phone minimal 8 digit
    const phonePattern = /^[0-9+\-\s]{8,20}$/;
    if (!phonePattern.test(phone)) {
    Swal.fire({
        icon: "warning",
        title: "Invalid Phone Number",
        text: "Please enter a valid phone number.",
        confirmButtonColor: "#000"
    });
    return;
    }

    // Validasi optional PDF (max 5MB)
    const pdfInput = form.document.files[0];
    if (pdfInput && pdfInput.size > 5 * 1024 * 1024) {
    Swal.fire({
        icon: "warning",
        title: "File Too Large",
        text: "Uploaded PDF must be 5MB or smaller.",
        confirmButtonColor: "#000"
    });
    return;
    }

    // Semua valid → kirim ke client
    emailjs.sendForm(
    "service_nxj9nf6",   // Service ID
    "template_s5l1aiq",  // Template client Discuss
    form,
    "Jf33d7klVKhYm6uBE"  // Public Key
    ).then(() => {
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
    console.error("EmailJS error:", err);
    });
});
})();
  