tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0fdf4",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
        },
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
    },
  },
};

// Form elements
const form = document.getElementById("whatsappForm");
const ddiInput = document.getElementById("ddi");
const phoneInput = document.getElementById("phone");
const messageInput = document.getElementById("message");
const clearBtn = document.getElementById("clearBtn");
const linkSection = document.getElementById("linkSection");
const generatedLink = document.getElementById("generatedLink");
const copyBtn = document.getElementById("copyBtn");
const whatsappBtn = document.getElementById("whatsappBtn");
const shareBtn = document.getElementById("shareBtn");

// Modal functionality
function openModal(modalId) {
  document.getElementById(modalId).classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.add("hidden");
  document.body.style.overflow = "auto";
}

// Smooth scrolling for anchor links
// IDs que são modais
const modalIds = ["privacidade", "termos", "cookies", "faq", "tutoriais"];

// Só intercepta links que abrem modal
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href").substring(1);

    if (modalIds.includes(targetId)) {
      e.preventDefault();
      openModal(targetId);
    }
    // se NÃO for modal (recursos, sobre, contato), deixa o navegador
    // fazer o scroll padrão com animação via CSS
  });
});

// Close modals on background click
document.querySelectorAll("[id]").forEach((modal) => {
  if (
    ["privacidade", "termos", "cookies", "faq", "tutoriais"].includes(modal.id)
  ) {
    modal.addEventListener("click", function (e) {
      if (e.target === this) {
        closeModal(this.id);
      }
    });
  }
});

// Generate WhatsApp link
function generateWhatsAppLink(ddi, phone, message = "") {
  const cleanDDI = ddi.replace(/\D/g, "");
  const cleanPhone = phone.replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(message);

  let link = `https://wa.me/${cleanDDI}${cleanPhone}`;
  if (message) {
    link += `?text=${encodedMessage}`;
  }

  return link;
}

// Form submission
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const ddi = ddiInput.value.trim();
  const phone = phoneInput.value.trim();
  const message = messageInput.value.trim();

  if (!ddi || !phone) {
    alert("Por favor, preencha o DDI e o número do WhatsApp.");
    return;
  }

  const link = generateWhatsAppLink(ddi, phone, message);
  generatedLink.value = link;
  linkSection.classList.remove("hidden");

  // Scroll to link section
  linkSection.scrollIntoView({ block: "nearest" });
  // ou simplesmente remove esse scroll se não fizer tanta questão
});

// Clear form
clearBtn.addEventListener("click", function () {
  ddiInput.value = "";
  phoneInput.value = "";
  messageInput.value = "";
  linkSection.classList.add("hidden");
});

// Copy link
copyBtn.addEventListener("click", function () {
  generatedLink.select();
  document.execCommand("copy");

  // Visual feedback
  const originalText = copyBtn.innerHTML;
  copyBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Copiado!';
  copyBtn.classList.remove("bg-gray-600", "hover:bg-gray-700");
  copyBtn.classList.add("bg-green-500", "hover:bg-green-600");

  setTimeout(() => {
    copyBtn.innerHTML = originalText;
    copyBtn.classList.remove("bg-green-500", "hover:bg-green-600");
    copyBtn.classList.add("bg-gray-600", "hover:bg-gray-700");
  }, 2000);
});

// Open WhatsApp
whatsappBtn.addEventListener("click", function () {
  window.open(generatedLink.value, "_blank");
});

// Share link
shareBtn.addEventListener('click', async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Título da página',
        text: 'Olha que conteúdo legal!',
        url: window.location.href
      });
    } catch (error) {
      console.error('Compartilhamento cancelado ou falhou:', error);
    }
  } else {
    alert('Compartilhamento não suportado neste navegador.');
  }
});
// Input validation
[ddiInput, phoneInput].forEach((input) => {
  input.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "");
  });
});
