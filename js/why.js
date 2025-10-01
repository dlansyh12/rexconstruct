// FAQ toggle with smooth expand
document.querySelectorAll('.faq-toggle').forEach(btn => {
btn.addEventListener('click', () => {
    const content = btn.nextElementSibling;
    const icon = btn.querySelector('.icon');
    
    if (content.style.maxHeight && content.style.maxHeight !== "0px") {
    content.style.maxHeight = "0px";
    icon.textContent = "+";
    } else {
    document.querySelectorAll('.faq-content').forEach(c => c.style.maxHeight = "0px");
    document.querySelectorAll('.faq-toggle .icon').forEach(i => i.textContent = "+");
    content.style.maxHeight = content.scrollHeight + "px";
    icon.textContent = "−";
    }
});
});